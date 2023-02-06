import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";
import DisputeBanner from "./dispute-banner";
import { Contract } from "web3-eth-contract"
import { Chain, SubmissionList, Transaction } from "../types";

const NoListsText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #cccccc;
`;

const ListViewer: React.FC<{
  governorContractInstance: Contract,
  chain: Chain,
  pendingLists: Transaction[],
  account: string,
  addToPendingLists: Function,
  costPerTx: number | undefined,
  onClear: Function,
  submittedLists: SubmissionList[]
}> = (p) => {
  if (p.pendingLists) {
    return (
      <ListBox
        txs={p.pendingLists}
        listID="1"
        submitter={p.account}
        submittable={true}
        showByDefault={true}
        costPerTx={p.costPerTx}
        governorContractInstance={p.governorContractInstance}
        chain={p.chain}
        addToPendingLists={p.addToPendingLists}
        onClear={p.onClear}
        account={p.account}
      />
    );
  }

  if (!p.submittedLists || !p.submittedLists.length)
    return <NoListsText>No Lists Yet</NoListsText>;

  return (
    <div>
      {p.submittedLists.length
        ? p.submittedLists.map((sub, i) => (
          <ListBox
            key={i}
            listID={sub.listID}
            txs={sub.txs}
            submittable={false}
            showByDefault={false}
            submittedAt={sub.submittedAt}
            submitter={sub.submitter}
            governorContractInstance={p.governorContractInstance}
            chain={p.chain}
            account={p.account}
            onClear={() => { }}
            addToPendingLists={() => { }}
          />
        ))
        : ""}
      {p.submittedLists.length > 1 ? <DisputeBanner /> : ""}
    </div>
  );
}

export default ListViewer;
