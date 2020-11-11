import React, { useState } from "react";
import styled from "styled-components";
import ListBoxTopMenu from "./top-menu";
import ListBoxLists from "./lists";
import { useIsWithdrawable } from "../../hooks/governor";
import WithdrawBanner from "../withdraw-banner";

export default ({
  txs,
  submitter,
  submittable,
  costPerTx,
  governorContractInstance,
  showByDefault,
  addToPendingLists,
  submittedAt,
  listID,
  web3,
  abiCache,
  setAbiCache,
  account,
}) => {
  const [showLists, setShowLists] = useState(showByDefault);
  // If list is pending it won't have submittedAt timestamp
  const [isWithdrawable, timeout] = useIsWithdrawable(
    governorContractInstance,
    submittedAt || new Date()
  );

  const showHideLists = () => {
    setShowLists(!showLists);
  };

  return (
    <div>
      <ListBoxTopMenu
        listNumber={listID}
        numberOfTxs={txs.length}
        submittedAt={submittedAt}
        submitter={submitter}
        setShowHide={showHideLists}
        withdrawable={isWithdrawable && !submittable && submitter === account}
        governorContractInstance={governorContractInstance}
        account={account}
      />
      {showLists ? (
        <ListBoxLists
          txs={txs}
          submittable={submittable}
          submitter={submitter}
          governorContractInstance={governorContractInstance}
          costPerTx={costPerTx}
          addToPendingLists={addToPendingLists}
          web3={web3}
          abiCache={abiCache}
          setAbiCache={setAbiCache}
        />
      ) : (
        ""
      )}
      {isWithdrawable && !submittable && submitter === account ? (
        <WithdrawBanner timeout={timeout} />
      ) : (
        ""
      )}
    </div>
  );
};
