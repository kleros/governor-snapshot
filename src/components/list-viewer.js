import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";
import DisputeBanner from "./dispute-banner";

import {
  useFetchSubmittedLists,
} from "../hooks/governor";

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
  onClear
}) => {
  const submittedLists = useFetchSubmittedLists(
    governorContractInstance,
    web3,
    session.currentSessionNumber || "0"
  );

  if (pendingLists && pendingLists.length) {
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
      {submittedLists.length > 1 ? <DisputeBanner /> : ""}
    </div>
  );
};
