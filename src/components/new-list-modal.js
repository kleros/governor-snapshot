import { Button, Modal, Input } from "antd";
import React, { useState, Fragment } from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
  float: right;
  min-width: 110px;
  font-size: 16px;
  line-height: 22px;
`;
const InputLabel = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <StyledButton type="primary" onClick={() => setVisible(true)}>
        New List
      </StyledButton>
      <Modal visible={visible} maskClosable onCancel={() => setVisible(false)}>
        <InputLabel>Title</InputLabel>
        <Input placeholder={"eg. Update Non Technical Juror Fee"} />
        <InputLabel>Contract Address</InputLabel>
        <Input placeholder={"eg. Update Non Technical Juror Fee"} />
      </Modal>
    </Fragment>
  );
};
