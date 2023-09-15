import { Contract } from "web3-eth-contract";
import { useEffect, useState } from "react";
import { orderParametersByHash } from "../util/tx-hash";
import web3 from "../ethereum/web3";
import {
  RoundInfo,
  Session,
  SubmissionList,
  Transaction,
  TransactionInfo,
} from "../types";
import { EventData } from "web3-eth-contract";
import { BlockTransactionString } from "web3-eth";

/**
 Fetch the time of the start of the session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the start of the session
 */
export const useFetchSessionStart = (governorContractInstance: Contract) => {
  const [sessionStart, setSessionStart] = useState(new Date(0));

  useEffect(() => {
    const _getLastApprovalTime = async () => {
      const _lastApprovalTime = await governorContractInstance.methods
        .lastApprovalTime()
        .call();
      setSessionStart(new Date(Number(_lastApprovalTime) * 1000));
    };
    _getLastApprovalTime();
  }, []);

  return sessionStart;
};

/**
 Fetch the end of the current session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the end of the session
 */
export const useFetchSessionEnd = (
  governorContractInstance: Contract,
  sessionNumber: number
) => {
  const [submissionTimeout, setSubmissionTimeout] = useState(0);
  const [durationOffset, setDurationOffset] = useState(0);
  const sessionStart = useFetchSessionStart(governorContractInstance);

  // Initial calls
  useEffect(() => {
    // Fetch submission timeout
    governorContractInstance.methods
      .submissionTimeout()
      .call()
      .then((r: number) => {
        setSubmissionTimeout(Number(r));
      });
  }, []);

  // Fetch durationOffset after we have the session number
  useEffect(() => {
    governorContractInstance.methods
      .sessions(sessionNumber)
      .call()
      .then((r: { durationOffset: number }) => {
        setDurationOffset(Number(r.durationOffset));
      });
  }, [sessionNumber]);

  return new Date(
    (sessionStart.getTime() / 1000 +
      Number(submissionTimeout) +
      Number(durationOffset)) *
      1000
  );
};

export const submitPendingList = (
  txs: Transaction[],
  governorContractInstance: Contract,
  costPerTx: number | undefined,
  account: string
) => {
  const { addresses, values, data, dataSizes, titles } = orderParametersByHash(
    txs
  );

  governorContractInstance.methods
    .submitList(addresses, values, data, dataSizes, titles)
    .send({
      value: costPerTx,
      from: account,
    });
};

export const submitEmptyList = (
  governorContractInstance: Contract,
  submitter: string,
  costPerTx: number | undefined
) => {
  governorContractInstance.methods.submitList([], [], "0x", [], "").send({
    from: submitter,
    value: costPerTx,
  });
};

export const useIsWithdrawable = (
  governorContractInstance: Contract,
  submittedAt: Date
): [boolean, Date] => {
  const [timeout, setTimeout] = useState(0);

  // Fetch timeout for this contract
  useEffect(() => {
    governorContractInstance.methods
      .withdrawTimeout()
      .call()
      .then((r: number) => setTimeout(r));
  }, [governorContractInstance]);

  const now = new Date();

  return [
    Number(timeout) * 1000 + submittedAt.getTime() > now.getTime(),
    new Date(Number(timeout) * 1000 + submittedAt.getTime()),
  ];
};

/**
 Fetch the end of the current session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the end of the session
 */
export const useFetchSubmittedLists = (
  governorContractInstance: Contract,
  sessionNumber: number
) => {
  const [fromBlock, setFromBlock] = useState<number>();
  const [sessionListIDs, setSessionListIDs] = useState<number[]>([]);
  const [listEventLogs, setListEventLogs] = useState<EventData[][]>([]);
  const [numberOfTxs, setNumberOfTxs] = useState<number[]>([]);
  const [listTxData, setListTxData] = useState<SubmissionList[]>([]);

  // Fetch ListIDs for session. Also fetch fromBlock, the reference point to query logs
  useEffect(() => {
    governorContractInstance.methods
      .getSubmittedLists(sessionNumber)
      .call()
      .then((r: number[]) => {
        setSessionListIDs(r);
      });
    // could be -50_000 in mainnet, but -100_000 works for both
    web3.eth.getBlockNumber().then((block) => setFromBlock(block - 100_000));
  }, [sessionNumber]);

  // Fetch Event logs and number of txs for each List
  useEffect(() => {
    const _fetchAllEventsForListIDs = async () => {
      const _events: EventData[][] = await Promise.all(
        sessionListIDs.map((_listID) => {
          return governorContractInstance.getPastEvents("ListSubmitted", {
            filter: { _listID },
            fromBlock: fromBlock,
          });
        })
      );
      const _numberOfTxs: number[] = await Promise.all(
        sessionListIDs.map((_listID) => {
          return governorContractInstance.methods
            .getNumberOfTransactions(_listID)
            .call();
        })
      );
      setListEventLogs(_events);
      setNumberOfTxs(_numberOfTxs);
    };
    _fetchAllEventsForListIDs();
  }, [sessionListIDs, fromBlock]);

  // Get transaction info for each List
  useEffect(() => {
    const _fetchTxInfo = async () => {
      let _txInfo: SubmissionList[] = [];
      if (
        listEventLogs.length &&
        sessionListIDs &&
        listEventLogs.length === sessionListIDs.length &&
        numberOfTxs
      ) {
        _txInfo = await Promise.all(
          sessionListIDs.map(async (_listID, i) => {
            const txs = [];
            const titles = listEventLogs[i][0].returnValues._description.split(
              ","
            );
            for (let j = 0; j < numberOfTxs[i]; j++) {
              // Get tx info
              const info: TransactionInfo = await governorContractInstance.methods
                .getTransactionInfo(_listID, j)
                .call();
              txs.push({
                title: titles[j],
                data: info.data || "0x",
                address: info.target,
                value: info.value,
              });
            }
            const submittedAt = (
              await new Promise<BlockTransactionString>((resolve, reject) => {
                web3.eth.getBlock(
                  listEventLogs[i][0].blockNumber,
                  (error, result) => {
                    if (error) reject(error);

                    resolve(result);
                  }
                );
              })
            ).timestamp;
            return {
              submitter: listEventLogs[i][0].returnValues._submitter,
              submittedAt: new Date(Number(submittedAt) * 1000),
              txs,
              listID: _listID.toString(),
            };
          })
        );
      }
      setListTxData(_txInfo);
    };

    _fetchTxInfo();
  }, [listEventLogs, numberOfTxs, sessionListIDs]);

  return listTxData;
};

export const useFetchSubmissionHash = (
  governorContractInstance: Contract,
  listID: string
) => {
  const [submissionHash, setSubmissionHash] = useState<string>("");

  useEffect(() => {
    governorContractInstance.methods
      .submissions(listID)
      .call()
      .then((r: { listHash: string }) => setSubmissionHash(r.listHash));
  }, [governorContractInstance, listID]);

  return submissionHash;
};

export const useFetchArbitratorExtraData = (
  governorContractInstance: Contract
) => {
  const [arbitratorExtraData, setArbitratorExtraData] = useState("0x0");

  useEffect(() => {
    governorContractInstance.methods
      .arbitratorExtraData()
      .call()
      .then((r: string) => setArbitratorExtraData(r));
  }, [governorContractInstance]);

  return arbitratorExtraData;
};

export const useFetchCrowdfundingVariables = (
  governorContractInstance: Contract
) => {
  const [winnerMultiplier, setWinnerMultiplier] = useState(0);
  const [loserMultiplier, setLoserMultiplier] = useState(0);
  const [sharedMultiplier, setSharedMultiplier] = useState(0);
  const [multiplierDivisor, setMultiplierDivisor] = useState(1);

  useEffect(() => {
    governorContractInstance.methods
      .winnerMultiplier()
      .call()
      .then((r: number) => setWinnerMultiplier(r));
    governorContractInstance.methods
      .loserMultiplier()
      .call()
      .then((r: number) => setLoserMultiplier(r));
    governorContractInstance.methods
      .sharedMultiplier()
      .call()
      .then((r: number) => setSharedMultiplier(r));
    governorContractInstance.methods
      .MULTIPLIER_DIVISOR()
      .call()
      .then((r: number) => setMultiplierDivisor(r));
  }, [governorContractInstance]);

  return {
    winnerMultiplier,
    loserMultiplier,
    sharedMultiplier,
    multiplierDivisor,
  };
};

export const useFetchRoundInfo = (
  governorContractInstance: Contract,
  sessionNumber: number
) => {
  const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
  const [roundInformation, setRoundInformation] = useState<
    RoundInfo | undefined
  >(undefined);

  useEffect(() => {
    governorContractInstance.methods
      .getSessionRoundsNumber(sessionNumber)
      .call()
      .then((r: number) => setNumberOfRounds(r));
  }, [governorContractInstance]);

  useEffect(() => {
    governorContractInstance.methods
      .getRoundInfo(sessionNumber, numberOfRounds)
      .call()
      .then((r: RoundInfo) => setRoundInformation(r));
  }, [numberOfRounds]);

  return {
    ...roundInformation,
    numberOfRounds,
  };
};

export const useFetchSession = (governorContractInstance: Contract) => {
  const [currentSessionNumber, setCurrentSessionNumber] = useState<number>(0);
  const [session, setSession] = useState<Session>({
    disputeID: 0,
    currentSessionNumber: 0,
    status: 0,
  });

  useEffect(() => {
    governorContractInstance.methods
      .getCurrentSessionNumber()
      .call()
      .then((r: number) => setCurrentSessionNumber(r));
  }, [governorContractInstance]);

  useEffect(() => {
    governorContractInstance.methods
      .sessions(currentSessionNumber)
      .call()
      .then((r: Session) => setSession(r));
  }, [currentSessionNumber]);

  return {
    ...session,
    currentSessionNumber,
  };
};

export const useFetchListSubmissionCost = (
  governorContractInstance: Contract,
  arbitratorContractInstance: Contract
) => {
  const [submissionBaseDeposit, setSubmissionBaseDeposit] = useState(0);
  const [extraData, setExtraData] = useState("0x00");
  const [costPerList, setCostPerList] = useState<number | undefined>(0);

  useEffect(() => {
    governorContractInstance.methods
      .submissionBaseDeposit()
      .call()
      .then((r: number) => setSubmissionBaseDeposit(r));
    governorContractInstance.methods
      .arbitratorExtraData()
      .call()
      .then((r: string) => setExtraData(r));
  }, [governorContractInstance]);

  useEffect(() => {
    arbitratorContractInstance.methods
      .arbitrationCost(extraData)
      .call()
      .then((r: string) => {
        setCostPerList(
          Number(web3.utils.toBN(submissionBaseDeposit).add(web3.utils.toBN(r)))
        );
      });
  }, [extraData, submissionBaseDeposit]);

  return costPerList;
};
