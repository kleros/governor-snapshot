import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { orderParametersByHash } from "../util/tx-hash";
import web3 from "../ethereum/web3";
import { RoundInfo } from "../types";

export const submitPendingList = (
  txs: any[],
  governorContractInstance: Contract,
  costPerTx: any,
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

export const submitEmptyList: any = (
  governorContractInstance: Contract,
  submitter: string,
  costPerTx: any
) => {
  governorContractInstance.methods.submitList([], [], '0x', [], '').send({
    from: submitter,
    value: costPerTx
  })
}

export const useIsWithdrawable = (governorContractInstance: Contract, submittedAt: Date): [boolean, Date] => {
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
  const [sessionListIDs, setSessionListIDs] = useState<number[]>([]);
  const [listEventLogs, setListEventLogs] = useState<any[]>([]);
  const [numberOfTxs, setNumberOfTxs] = useState<number[]>([]);
  const [listTxData, setListTxData] = useState<any[]>([]);

  // Fetch ListIDs for session
  useEffect(() => {
    governorContractInstance.methods
      .getSubmittedLists(sessionNumber)
      .call()
      .then((r: number[]) => {
        setSessionListIDs(r);
      });
  }, [sessionNumber]);

  // Fetch Event logs and number of txs for each List
  useEffect(() => {
    const _fetchAllEventsForListIDs = async () => {
      const _events: any[] = await Promise.all(
        sessionListIDs.map((_listID) => {
          return governorContractInstance.getPastEvents("ListSubmitted", {
            filter: { _listID },
            fromBlock: 0,
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
  }, [sessionListIDs]);

  // Get transaction info for each List
  useEffect(() => {
    const _fetchTxInfo = async () => {
      let _txInfo: any[] = [];
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
              await new Promise<any>((resolve, reject) => {
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

export const useFetchRoundInfo = (governorContractInstance: Contract, sessionNumber: number) => {
  const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
  const [roundInformation, setRoundInformation] = useState<RoundInfo | undefined>(undefined);

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