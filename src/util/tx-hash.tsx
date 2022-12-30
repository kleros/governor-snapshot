import web3 from "../ethereum/web3";
import { Transaction } from "../types";

export const txHash = (target: string, value: any, data: string) => {
  return web3.utils.soliditySha3(target, value, data) || "0";
};

export const orderParametersByHash = (txs: Transaction[]) => {
  const addresses: string[] = [];
  const values: any[] = [];
  let data = "0x";
  const dataSizes: number[] = [];
  let titles = "";

  txs.forEach((tx, i) => {
    // Remove 0x
    if (tx.data.length > 1 && tx.data.substring(0, 2) === "0x") {
      tx.data = tx.data.substr(2);
    }
  });

  const _sortedTxs = txs.sort((a: Transaction, b: Transaction) => {
    return (
      parseInt(txHash(a.address, a.value, "0x" + a.data), 16) -
      parseInt(txHash(b.address, b.value, "0x" + b.data), 16)
    );
  });

  _sortedTxs.forEach((tx) => {
    addresses.push(tx.address);
    values.push(tx.value);
    data += tx.data;
    dataSizes.push(tx.data.length / 2);
    titles += tx.title + ",";
  });

  return {
    addresses,
    values,
    data,
    dataSizes,
    titles,
  };
};
