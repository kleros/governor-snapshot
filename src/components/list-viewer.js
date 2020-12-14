import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";

const NoListsText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #cccccc;
`;

export default ({
  governorContractInstance,
  arbitratorContractInstance,
  pendingLists,
  account,
  addToPendingLists,
  web3,
  abiCache,
  setAbiCache,
  session,
  costPerTx,
  onClear,
  submittedLists,
  setPendingTx
}) => {
  if (pendingLists) {
    return (
      <ListBox
        txs={pendingLists}
        listID={"1"}
        submitter={account}
        submittable={true}
        showByDefault={true}
        costPerTx={costPerTx}
        governorContractInstance={governorContractInstance}
        addToPendingLists={addToPendingLists}
        web3={web3}
        abiCache={abiCache}
        setAbiCache={setAbiCache}
        onClear={onClear}
        setPendingTx={setPendingTx}
      />
    );
  }

  if (!submittedLists || !submittedLists.length)
    return <NoListsText>No Lists Yet</NoListsText>;

  return (
    <div>
      {submittedLists.length
        ? submittedLists.map((sub, i) => (
            <ListBox
              key={i}
              listID={sub.listID}
              txs={sub.txs}
              submittable={false}
              showByDefault={false}
              submittedAt={sub.submittedAt}
              submitter={sub.submitter}
              web3={web3}
              abiCache={abiCache}
              setAbiCache={setAbiCache}
              governorContractInstance={governorContractInstance}
              account={account}
            />
          ))
        : ""}
    </div>
  );
};
