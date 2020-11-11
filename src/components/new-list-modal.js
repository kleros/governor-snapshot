import { Button, Modal, Input, Radio, Select, Tooltip } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import { useFetchMethodsForContract } from "../hooks/projects";
import styled from "styled-components";

const StyledButton = styled(Button)`
  float: right;
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

export default ({
  setPendingLists,
  disabled,
  addTx,
  web3,
  abiCache,
  setAbiCache,
}) => {
  const [visible, setVisible] = useState(false);
  const [inputType, setInputType] = useState("data");
  const [title, setTitle] = useState();
  const [address, setAddress] = useState();
  const [value, setValue] = useState("0");
  const [data, setData] = useState();
  const [submittable, setSubmittable] = useState(false);
  const [methodSelected, setMethodSelected] = useState();
  const [methodInputs, setMethodInputs] = useState([]);
  const [methods, abi] = useFetchMethodsForContract(
    address,
    abiCache,
    setAbiCache
  );

  const methodToData = () => {
    const contractInstance = new web3.eth.Contract(abi, address);
    return contractInstance.methods[methodSelected](
      ...methodInputs
    ).encodeABI();
  };

  const clearForm = () => {
    setInputType("data");
    setTitle(undefined);
    setAddress(undefined);
    setValue(undefined);
    setData(undefined);
    setSubmittable(true);
    setMethodSelected(undefined);
    setMethodInputs([]);
    setVisible(false);
  };

  const submitNewTx = () => {
    if (inputType === "data") {
      setPendingLists({
        title,
        address,
        value,
        data,
      });
      clearForm();
    } else {
      // get data from inputs
      const _data = methodToData();
      setPendingLists({
        title,
        address,
        value,
        data: _data,
      });
      clearForm();
    }
  };

  useEffect(() => {
    if (methods.length && !data) setInputType("contract");
  }, [methods]);

  const _setMethodInput = (val, index) => {
    const _methodInputs = [...methodInputs];
    _methodInputs[index] = val;
    setMethodInputs(_methodInputs);
  };

  useEffect(() => {
    if (title && address && value) {
      if (inputType == "contract") {
        // Check to see if all inputs are filled
        const numberOfInputs = methods.filter(
          (a) => a.name === methodSelected
        )[0].inputs.length;
        if (numberOfInputs === methodInputs.length) {
          if (!submittable) setSubmittable(true);
        } else if (submittable) {
          setSubmittable(false);
        }
      } else if (inputType == "data") {
        if (data) {
          if (!submittable) setSubmittable(true);
        } else if (submittable) {
          setSubmittable(false);
        }
      }
    }
  }, [title, address, value, data, methodSelected, methodInputs]);

  return (
    <Fragment>
      <StyledButton
        disabled={disabled}
        type={!addTx && "primary"}
        onClick={() => setVisible(true)}
      >
        {addTx ? "Add Tx" : "New List"}
      </StyledButton>
      <Modal
        visible={visible}
        maskClosable
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <InputHeader>Add TX to the List</InputHeader>
        <InputLabel>Title</InputLabel>
        <Input
          placeholder={"eg. Update Non Technical Juror Fee"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputLabel>Contract Address</InputLabel>
        <Input
          placeholder={"eg. 0x60B2AbfDfaD9c0873242f59f2A8c32A3Cc682f80"}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <InputLabel>
          <Tooltip title="in WEI">Value</Tooltip>
        </InputLabel>
        <Input
          placeholder={"eg. 0"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Radio.Group
          style={{ margin: "25px 0px" }}
          onChange={(e) => setInputType(e.target.value)}
          value={inputType}
        >
          <StyledRadioOption value={"data"}>Data Input</StyledRadioOption>
          <StyledRadioOption disabled={!methods.length} value={"contract"}>
            Contract Input
          </StyledRadioOption>
        </Radio.Group>
        {inputType === "data" ? (
          <StyledTextArea
            autosize={{ minRows: 10, maxRows: 20 }}
            allowClear={true}
            value={data}
            placeholder={
              "0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000)"
            }
            onChange={(e) => setData(e.target.value)}
          />
        ) : (
          <Fragment>
            <div>
              <StyledSelect onChange={setMethodSelected}>
                {methods.map((m) => {
                  return (
                    <Select.Option key={m.name} value={m.name}>
                      {m.name}
                    </Select.Option>
                  );
                })}
              </StyledSelect>
            </div>
            {methodSelected ? (
              <div>
                {methods
                  .filter((a) => a.name === methodSelected)[0]
                  .inputs.map((input, i) => {
                    return (
                      <div key={i}>
                        <InputLabel>{input.name}</InputLabel>
                        <Input
                          placeholder={input.type}
                          onChange={(e) => _setMethodInput(e.target.value, i)}
                        />
                      </div>
                    );
                  })}
              </div>
            ) : (
              ""
            )}
          </Fragment>
        )}
        <StyledSubmit
          type="primary"
          disabled={!submittable}
          onClick={submitNewTx}
        >
          Submit
        </StyledSubmit>
      </Modal>
    </Fragment>
  );
};
