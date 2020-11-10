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
  listID,
  web3,
  abiCache,
  setAbiCache
}) => {
  const [showLists, setShowLists] = useState(showByDefault);

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
    </div>
  );
};
