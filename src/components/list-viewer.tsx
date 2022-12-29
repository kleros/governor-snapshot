import React from "react";
import styled from "styled-components";

import ListBox from "./list-box/index";
import DisputeBanner from "./dispute-banner";
import { Contract } from "ethers";
import { Chain } from "../types";
import web3 from "../ethereum/web3";

const NoListsText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #cccccc;
`;

const ListViewer: React.FC<{
  governorContractInstance: Contract,
  chain: Chain,
  pendingLists: any[],
  account: string,
  addToPendingLists: any,
  costPerTx: any,
  onClear: any,
  submittedLists: any[]
}> = (p) => {
  if (p.pendingLists) {
    return (
      <ListBox
        txs={p.pendingLists}
        listID={"1"}
        submitter={p.account}
        submittable={true}
        showByDefault={true}
        costPerTx={p.costPerTx}
        governorContractInstance={p.governorContractInstance}
        chain={p.chain}
        addToPendingLists={p.addToPendingLists}
        web3={web3}
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
            web3={web3}
            governorContractInstance={p.governorContractInstance}
            chain={p.chain}
            account={p.account}
          />
        ))
        : ""}
      {p.submittedLists.length > 1 ? <DisputeBanner /> : ""}
    </div>
  );
}

export default ListViewer;
