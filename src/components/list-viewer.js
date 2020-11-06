import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";

import {
  useFetchSubmittedLists,
  useFetchListSubmissionCost,
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
}) => {
  const submittedLists = useFetchSubmittedLists(governorContractInstance);
  const costPerlist = useFetchListSubmissionCost(
    governorContractInstance,
    arbitratorContractInstance
  );

  if (pendingLists && pendingLists.length) {
    return (
      <ListBox
        txs={pendingLists}
        account={account}
        submittable={true}
        showByDefault={true}
        costPerTx={costPerlist}
        governorContractInstance={governorContractInstance}
        addToPendingLists={addToPendingLists}
      />
    );
  }

  if (!submittedLists || !submittedLists.length)
    return <NoListsText>No Lists Yet</NoListsText>;

  return (
    <ListBox txs={submittedLists} submittable={false} showByDefault={false} />
  );
};
