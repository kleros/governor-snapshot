import { Contract } from "ethers";
import { orderParametersByHash } from "../util/tx-hash";

export const submitPendingList: any = (
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
