import { useState, useEffect } from "react";
import Web3 from "web3";
import { orderParametersByHash } from "../util/tx-hash";
import useValidateCurrentChain from "./chain";

/**
 Fetch the time of the start of the session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the start of the session
 */
export const useFetchSessionNumber = (governorContractInstance) => {
  const [sessionNumber, setSessionNumber] = useState(0);

  useEffect(() => {
    governorContractInstance.methods
      .getCurrentSessionNumber()
      .call()
      .then((r) => {
        setSessionNumber(Number(r));
      });
  }, [governorContractInstance]);

  return sessionNumber;
};

/**
 Fetch the time of the start of the session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the start of the session
 */
export const useFetchSessionStart = (governorContractInstance) => {
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
export const useFetchSessionEnd = (governorContractInstance, sessionNumber) => {
  const [submissionTimeout, setSubmissionTimeout] = useState(0);
  const [durationOffset, setDurationOffset] = useState(0);
  const sessionStart = useFetchSessionStart(governorContractInstance);

  // Initial calls
  useEffect(() => {
    // Fetch submission timeout
    governorContractInstance.methods
      .submissionTimeout()
      .call()
      .then((r) => {
        setSubmissionTimeout(Number(r));
      });
  }, []);

  // Fetch durationOffset after we have the session number
  useEffect(() => {
    governorContractInstance.methods
      .sessions(sessionNumber)
      .call()
      .then((r) => {
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

/**
 Fetch the end of the current session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the end of the session
 */
export const useFetchSubmittedLists = (
  governorContractInstance,
  web3,
  sessionNumber
) => {
  const [sessionListIDs, setSessionListIDs] = useState([]);
  const [listEventLogs, setListEventLogs] = useState([]);
  const [numberOfTxs, setNumberOfTxs] = useState([]);
  const [listTxData, setListTxData] = useState([]);

  // Fetch ListIDs for session
  useEffect(() => {
    governorContractInstance.methods
      .getSubmittedLists(sessionNumber)
      .call()
      .then((r) => {
        setSessionListIDs(r);
      });
  }, [sessionNumber]);

  // Fetch Event logs and number of txs for each List
  useEffect(() => {
    const _fetchAllEventsForListIDs = async () => {
      const _events = await Promise.all(
        sessionListIDs.map((_listID) => {
          return governorContractInstance.getPastEvents("ListSubmitted", {
            filter: { _listID },
            fromBlock: 0,
          });
        })
      );
      const _numberOfTxs = await Promise.all(
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
  }, [sessionListIDs]);

  // Get transaction info for each List
  useEffect(() => {
    const _fetchTxInfo = async () => {
      let _txInfo = [];
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
              const info = await governorContractInstance.methods
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
              await new Promise((resolve, reject) => {
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
              listID: _listID,
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

export const useFetchListSubmissionCost = (
  governorContractInstance,
  arbitratorContractInstance
) => {
  const [submissionBaseDeposit, setSubmissionBaseDeposit] = useState(0);
  const [extraData, setExtraData] = useState("0x00");
  const [costPerList, setCostPerList] = useState(0);

  useEffect(() => {
    governorContractInstance.methods
      .submissionBaseDeposit()
      .call()
      .then((r) => setSubmissionBaseDeposit(r));
    governorContractInstance.methods
      .arbitratorExtraData()
      .call()
      .then((r) => setExtraData(r));
  }, [governorContractInstance]);

  useEffect(() => {
    arbitratorContractInstance.methods
      .arbitrationCost(extraData)
      .call()
      .then((r) => {
        const _web3 = new Web3();

        setCostPerList(
          _web3.utils.toBN(submissionBaseDeposit).add(_web3.utils.toBN(r))
        );
      });
  }, [extraData, submissionBaseDeposit]);

  return costPerList;
};

export const useSubmitPendingList = (
  txs,
  governorContractInstance,
  chain,
  costPerTx,
  account
) => {
  const { addresses, values, data, dataSizes, titles } = orderParametersByHash(
    txs
  );

  useValidateCurrentChain(chain);
  governorContractInstance.methods
    .submitList(addresses, values, data, dataSizes, titles)
    .send({
      value: costPerTx,
      from: account,
    });
};

export const useIsWithdrawable = (governorContractInstance, submittedAt) => {
  const [timeout, setTimeout] = useState(0);

  // Fetch timeout for this contract
  useEffect(() => {
    governorContractInstance.methods
      .withdrawTimeout()
      .call()
      .then((r) => setTimeout(r));
  }, [governorContractInstance]);

  const now = new Date();

  return [
    Number(timeout) * 1000 + submittedAt.getTime() > now.getTime(),
    new Date(Number(timeout) * 1000 + submittedAt.getTime()),
  ];
};

export const useFetchSubmissionHash = (governorContractInstance, listID) => {
  const [submissionHash, setSubmissionHash] = useState();

  useEffect(() => {
    governorContractInstance.methods
      .submissions(listID)
      .call()
      .then((r) => setSubmissionHash(r.listHash));
  }, [governorContractInstance, listID]);

  return submissionHash;
};

export const useFetchSession = (governorContractInstance) => {
  const [currentSessionNumber, setCurrentSessionNumber] = useState(0);
  const [session, setSession] = useState({});

  useEffect(() => {
    governorContractInstance.methods
      .getCurrentSessionNumber()
      .call()
      .then((r) => setCurrentSessionNumber(r));
  }, [governorContractInstance]);

  useEffect(() => {
    governorContractInstance.methods
      .sessions(currentSessionNumber)
      .call()
      .then((r) => setSession(r));
  }, [currentSessionNumber]);

  return {
    ...session,
    currentSessionNumber,
  };
};

export const useFetchRoundInfo = (governorContractInstance, sessionNumber) => {
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [roundInformation, setRoundInformation] = useState({});

  useEffect(() => {
    governorContractInstance.methods
      .getSessionRoundsNumber(sessionNumber)
      .call()
      .then((r) => setNumberOfRounds(r));
  }, [governorContractInstance]);

  useEffect(() => {
    governorContractInstance.methods
      .getRoundInfo(sessionNumber, numberOfRounds)
      .call()
      .then((r) => setRoundInformation(r));
  }, [numberOfRounds]);

  return {
    ...roundInformation,
    numberOfRounds,
  };
};

export const useFetchArbitratorExtraData = (governorContractInstance) => {
  const [arbitratorExtraData, setArbitratorExtraData] = useState("0x0");

  useEffect(() => {
    governorContractInstance.methods
      .arbitratorExtraData()
      .call()
      .then((r) => setArbitratorExtraData(r));
  }, [governorContractInstance]);

  return arbitratorExtraData;
};

export const useFetchCrowdfundingVariables = (governorContractInstance) => {
  const [winnerMultiplier, setWinnerMultiplier] = useState("0");
  const [loserMultiplier, setLoserMultiplier] = useState("0");
  const [sharedMultiplier, setSharedMultiplier] = useState("0");
  const [multiplierDivisor, setMultiplierDivisor] = useState("1");

  useEffect(() => {
    governorContractInstance.methods
      .winnerMultiplier()
      .call()
      .then((r) => setWinnerMultiplier(r));
    governorContractInstance.methods
      .loserMultiplier()
      .call()
      .then((r) => setLoserMultiplier(r));
    governorContractInstance.methods
      .sharedMultiplier()
      .call()
      .then((r) => setSharedMultiplier(r));
    governorContractInstance.methods
      .MULTIPLIER_DIVISOR()
      .call()
      .then((r) => setMultiplierDivisor(r));
  }, [governorContractInstance]);

  return {
    winnerMultiplier,
    loserMultiplier,
    sharedMultiplier,
    multiplierDivisor,
  };
};
