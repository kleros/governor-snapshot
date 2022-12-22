import React, { useState } from "react";
import ListBoxTopMenu from "./top-menu";
import ListBoxLists from "./lists";
import { useIsWithdrawable } from "../../hooks/governor-2";
import WithdrawBanner from "../withdraw-banner";
import { Contract } from "ethers";
import { Chain } from "../../types";
import Web3 from "../../ethereum/web3";

const ListBoxIndex: React.FC<{
  txs: any[],
  submitter: string,
  submittable: string,
  costPerTx: any,
  governorContractInstance: Contract,
  chain: Chain,
  showByDefault: boolean,
  addToPendingLists: any,
  submittedAt: Date,
  listID: string,
  web3: typeof Web3,
  account: string,
  onClear: any
}> = (p) => {
  const [showLists, setShowLists] = useState(p.showByDefault);
  // If list is pending it won't have submittedAt timestamp
  const [isWithdrawable, timeout] = useIsWithdrawable(
    p.governorContractInstance,
    p.submittedAt || new Date()
  );

  const showHideLists = () => {
    setShowLists(!showLists);
  };

  return (
    <div>
      <ListBoxTopMenu
        listNumber={p.listID}
        numberOfTxs={p.txs.length}
        submittedAt={p.submittedAt}
        submitter={p.submitter}
        setShowHide={showHideLists}
        withdrawable={isWithdrawable && !p.submittable && p.submitter === p.account}
        governorContractInstance={p.governorContractInstance}
        chain={p.chain}
        account={p.account}
      />
      {showLists ? (
        <ListBoxLists
          txs={p.txs}
          submittable={p.submittable}
          submitter={p.submitter}
          governorContractInstance={p.governorContractInstance}
          chain={p.chain}
          costPerTx={p.costPerTx}
          addToPendingLists={p.addToPendingLists}
          onClear={p.onClear}
        />
      ) : (
        ""
      )}
      {isWithdrawable && !p.submittable && p.submitter === p.account ? (
        <WithdrawBanner timeout={timeout} />
      ) : (
        ""
      )}
    </div>
  );
}

export default ListBoxIndex
