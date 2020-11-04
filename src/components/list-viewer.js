import React from "react";
import styled from "styled-components";

import { useFetchSubmittedLists } from "../hooks/governor";

const NoListsText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #cccccc;
`;

export default ({ governorContractInstance, pendingLists }) => {
  const submittedLists = useFetchSubmittedLists(governorContractInstance);
  if (!submittedLists || !submittedLists.length || !pendingLists)
    return <NoListsText>No Lists Yet</NoListsText>;
};
