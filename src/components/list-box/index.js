import React, { useState } from "react";
import styled from "styled-components";
import ListBoxTopMenu from "./top-menu";
import ListBoxLists from "./lists";

export default ({
  txs,
  submitter,
  submittable,
  costPerTx,
  governorContractInstance,
  showByDefault,
  addToPendingLists,
  submittedAt,
  web3
}) => {
  const [showLists, setShowLists] = useState(showByDefault);

  const showHideLists = () => {
    setShowLists(!showLists);
  };

  return (
    <div>
      <ListBoxTopMenu
        listNumber={1}
        numberOfTxs={txs.length}
        submittedAt={submittedAt}
        submitter={submitter}
        setShowHide={showHideLists}
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
        />
      ) : (
        ""
      )}
    </div>
  );
};
