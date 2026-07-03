import { Contract } from "web3-eth-contract";
import { useEffect, useState } from "react";
import { orderParametersByHash } from "../util/tx-hash";
import web3 from "../ethereum/web3";
import governorInterfaceABI from "../constants/abis/governor";
import {
  Chain,
  RoundInfo,
  Session,
  SubmissionList,
  Transaction,
  TransactionInfo,
} from "../types";

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
 * Tx titles are not stored in contract, only emitted in the ListSubmitted event.
 * The app relies on user wallet RPCs, which most likely will not serve old event logs,
 * so we try to get them from the block explorer API. We can match titles to list exactly
 * because the event also contains the list ID.
 * Note that if this fails for some reason, lists still render, but without titles.
 */
const fetchListTitles = async (
  governorAddress: string,
  chain: Chain,
  sessionNumber: number
): Promise<{ [listID: string]: string[] }> => {
  const titlesByListID: { [listID: string]: string[] } = {};
  try {
    const listSubmittedAbi = governorInterfaceABI.find(
      (item) => item.name === "ListSubmitted" && item.type === "event"
    );
    if (!listSubmittedAbi) return titlesByListID;
    const eventSignature = web3.eth.abi.encodeEventSignature(listSubmittedAbi);
    const session = web3.eth.abi.encodeParameter("uint256", sessionNumber);
    const response = await fetch(
      chain.scanListSubmittedLogsUrl(governorAddress, eventSignature, session)
    ).then((r) => r.json());
    if (!Array.isArray(response.result)) return titlesByListID;

    for (const log of response.result) {
      const decoded = web3.eth.abi.decodeLog(
        listSubmittedAbi.inputs || [],
        log.data,
        log.topics.slice(1) //the event topics without the event signature
      );
      titlesByListID[decoded._listID] = String(decoded._description).split(",");
    }
  } catch (error) {
    console.warn("Could not fetch list titles from block explorer", error);
  }
  return titlesByListID;
};

/**
 * Fetch all lists submitted during a session.
 * All list data, except titles, is read from the contract directly.
 * This way we avoid asking the user wallet RPCs for old event logs, which will, most likely, fail.
 */
export const useFetchSubmittedLists = (
  governorContractInstance: Contract,
  sessionNumber: number,
  chain: Chain
) => {
  const [listTxData, setListTxData] = useState<SubmissionList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const _fetchLists = async () => {
      setLoading(true);
      try {
        //Fetch IDs of the lists submitted during the session
        const listIDs: string[] = await governorContractInstance.methods
          .getSubmittedLists(sessionNumber)
          .call();

        if (!listIDs.length) {
          setListTxData([]);
          return;
        }

        //Attempt to get the titles for every list
        const titlesByListID = await fetchListTitles(
          governorContractInstance.options.address,
          chain,
          sessionNumber
        );

        const lists: SubmissionList[] = await Promise.all(
          listIDs.map(async (listID) => {
            //Fetch the submission data for the list
            const submission = await governorContractInstance.methods
              .submissions(listID)
              .call();

            //Fetch the number of transactions for the list
            const numberOfTxs = Number(
              await governorContractInstance.methods
                .getNumberOfTransactions(listID)
                .call()
            );

            //Attempt to get the title for the list from the existing map
            const titles = titlesByListID[listID.toString()] || [];

            //For each transaction in the list, fetch its data from the contract
            const txs: Transaction[] = await Promise.all(
              Array.from({ length: numberOfTxs }, async (_, i) => {
                const txInfo: TransactionInfo = await governorContractInstance.methods
                  .getTransactionInfo(listID, i)
                  .call();
                return {
                  title: titles[i] || "",
                  data: txInfo.data || "0x",
                  address: txInfo.target,
                  value: txInfo.value,
                };
              })
            );

            return {
              submitter: submission.submitter,
              submittedAt: new Date(Number(submission.submissionTime) * 1000),
              txs,
              listID: listID.toString(),
            };
          })
        );

        setListTxData(lists);
      } finally {
        //Always stop loading, even if a fetch fails, so the UI is not stuck on a spinner
        setLoading(false);
      }
    };

    _fetchLists();
  }, [sessionNumber]);

  return { submittedLists: listTxData, loading };
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
