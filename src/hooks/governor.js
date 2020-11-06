import { useState, useEffect } from "react";
import Web3 from 'web3'
import { orderParametersByHash } from '../util/tx-hash'

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
  }, []);

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
export const useFetchSessionEnd = (governorContractInstance) => {
  const [submissionTimeout, setSubmissionTimeout] = useState(0);
  const [durationOffset, setDurationOffset] = useState(0);
  const sessionStart = useFetchSessionStart(governorContractInstance);
  const sessionNumber = useFetchSessionNumber(governorContractInstance);

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
export const useFetchSubmittedLists = (governorContractInstance) => {
  const [sessionListIDs, setSessionListIDs] = useState([]);
  const [listEventLogs, setListEventLogs] = useState([]);
  const [numberOfTxs, setNumberOfTxs] = useState([]);
  const [listTxData, setListTxData] = useState([]);
  const sessionNumber = useFetchSessionNumber(governorContractInstance);

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
      const _txInfo = await Promise.all(
        sessionListIDs.map(async (_listID, i) => {
          const txs = [];
          const titles = listEventLogs[i].returnValues._description.split(",");
          for (let j = 0; j < numberOfTxs[i]; j++) {
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
          return {
            submitter: listEventLogs[i].returnValues._submitter,
            txs,
            listID: _listID,
          };
        })
      );
      setListTxData(_txInfo);
    };

    _fetchTxInfo();
  }, [listEventLogs, numberOfTxs, sessionListIDs]);

  return listTxData;
};

export const useFetchListSubmissionCost = (governorContractInstance, arbitratorContractInstance) => {
  const [ submissionBaseDeposit, setSubmissionBaseDeposit ] = useState(0)
  const [ extraData, setExtraData ] = useState('0x')
  const [ costPerList, setCostPerList ] = useState(0)

  useEffect(() => {
    governorContractInstance.methods.submissionBaseDeposit().call().then(r => setSubmissionBaseDeposit(r))
    governorContractInstance.methods.arbitratorExtraData().call().then(r => setExtraData(r))
  }, [governorContractInstance])

  useEffect(() => {
    arbitratorContractInstance.methods.arbitrationCost(extraData).call().then(r => {
      const _web3 = new Web3()

      setCostPerList(
        _web3.utils.toBN(submissionBaseDeposit).add(_web3.utils.toBN(r))
      )
    })
  }, [extraData])

  return costPerList
}

export const useSubmitPendingList = (txs, governorContractInstance, costPerTx, account) => {
  const { addresses, values, data, dataSizes, titles } = orderParametersByHash(txs)

  governorContractInstance.methods.submitList(addresses, values, data, dataSizes, titles).send({
    value: costPerTx,
    from: account
  })
}
