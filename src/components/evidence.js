import { Row, Col, Button } from 'antd';
import React from 'react';
import EvidenceModal from './evidence-modal';
import styled from 'styled-components';

const EvidenceContainer = styled.div`
  padding: 32px;
`

export default ({
  governorContractInstance,
  account
}) => {
  return (
    <EvidenceContainer>
      <EvidenceModal governorContractInstance={governorContractInstance} account={account}/>
    </EvidenceContainer>
  )
}
