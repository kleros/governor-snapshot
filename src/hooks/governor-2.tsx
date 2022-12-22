import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { orderParametersByHash } from "../util/tx-hash";

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