import { Button, Modal, Input, Radio, Select, Tooltip } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import { submitEvidence } from "../hooks/arbitrable";
import styled from "styled-components";

const StyledButton = styled(Button)`
  min-width: 110px;
  font-size: 16px;
  line-height: 22px;
`;
const InputLabel = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 19px;
  margin: 16px 0px 11px 0px;
`;
const InputHeader = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
  margin: 26px 0px;
  text-align: center;
`;
const StyledTextArea = styled(Input.TextArea)`
  background: rgba(255, 255, 255, 0.12);
  color: #000;
  min-height: 150px;

  ::placeholder {
    color: #fff
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
  }
`;
const StyledRadioOption = styled(Radio)`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;
const StyledSubmit = styled(Button)`
  margin: 20px 0px;
`;
const StyledSelect = styled(Select)`
  background: #ffffff;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
  min-width: 220px;
`;
const Error = styled.div`
  color: red;
  font-style: italic;
  font-size: 12px;
`;

export default ({
  disabled,
  governorContractInstance,
  account
}) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [file, setFile] = useState();
  const [errors, setErrors] = useState([]);
  const [submittable, setSubmittable] = useState(false);

  const clearForm = () => {
    setTitle(undefined);
    setDescription(undefined);
    setFile(undefined);
    setErrors([]);
    setVisible(false);
  };

  useEffect(() => {
    let _e = [...errors];
    let _newErrors = false;

    try {
      if (title && description) {
        setSubmittable(true)
      }

      if (_newErrors) {
        setSubmittable(false);
      }
    } catch (e) {}

  }, [title, description]);

  const _submitEvidence = () => {
    submitEvidence(
      governorContractInstance,
      {
        title,
        description,
        file
      },
      account
    )
  }

  return (
    <Fragment>
      <StyledButton
        disabled={disabled}
        type={"primary"}
        onClick={() => setVisible(true)}
      >
        Submit New Evidence
      </StyledButton>
      <Modal
        visible={visible}
        maskClosable
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <InputHeader>Submit New Evidence</InputHeader>
        <InputLabel>Title</InputLabel>
        <Input
          placeholder={"eg. The deliverable is not 100% correct."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      <InputLabel>Evidence Text</InputLabel>
        <StyledTextArea
          autosize={{ minRows: 10, maxRows: 20 }}
          allowClear={true}
          value={description}
          placeholder={
            "Your arguemnts..."
          }
          onChange={(e) => setDescription(e.target.value)}
        />
        <StyledSubmit
          type="primary"
          disabled={!submittable}
          onClick={_submitEvidence}
        >
          Submit
        </StyledSubmit>
      </Modal>
    </Fragment>
  );
};
