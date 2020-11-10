import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";
import DisputeBanner from './dispute-banner';

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
  web3,
  abiCache,
  setAbiCache
}) => {
  const submittedLists = useFetchSubmittedLists(governorContractInstance, web3);
  const costPerlist = useFetchListSubmissionCost(
    governorContractInstance,
    arbitratorContractInstance
  );

  if (pendingLists && pendingLists.length) {
    return (
      <ListBox
        txs={pendingLists}
        listID={"1"}
        submitter={account}
        submittable={true}
        showByDefault={true}
        costPerTx={costPerlist}
        governorContractInstance={governorContractInstance}
        addToPendingLists={addToPendingLists}
        web3={web3}
        abiCache={abiCache}
        setAbiCache={setAbiCache}
      />
    );
  }

  if (!submittedLists || !submittedLists.length)
    return <NoListsText>No Lists Yet</NoListsText>;

  return (
    <div>
       { submittedLists.length ? (
           submittedLists.map((sub, i) => (
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
         ) : ''
       }
       {
         submittedLists.length > 1 ? (
           <DisputeBanner />
         ) : ''
       }
    </div>

  );
};
