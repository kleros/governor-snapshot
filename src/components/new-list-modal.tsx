import { Button, Modal, Input, Radio, Select, Tooltip } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import { useFetchMethodsForContract } from "../hooks/projects-2";
import styled from "styled-components";
import web3 from "../ethereum/web3";
import { Contract, ContractFunction } from "ethers";
import { Chain } from "../types";

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
const Error = styled.div`
  color: red;
  font-style: italic;
  font-size: 12px;
`;

const NewListModal: React.FC<{
  setPendingLists: any,
  disabled: boolean,
  addTx: boolean,
  web3: typeof web3,
  governorContractInstance: Contract,
  chain: Chain,
  costPerTx: any
}> = (p) => {
  const [visible, setVisible] = useState(false);
  const [inputType, setInputType] = useState("data");
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [value, setValue] = useState("0");
  const [data, setData] = useState<string | undefined>();
  const [errors, setErrors] = useState<any[]>([]);
  const [submittable, setSubmittable] = useState(false);
  const [methodSelected, setMethodSelected] = useState<any>();
  const [methodInputs, setMethodInputs] = useState<any[]>([]);
  const [methods, abi] = useFetchMethodsForContract(
    address,
    p.chain
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
    setValue("0");
    setData(undefined);
    setSubmittable(true);
    setMethodSelected(undefined);
    setMethodInputs([]);
    setVisible(false);
  };

  const submitNewTx = () => {
    if (inputType === "data") {
      p.setPendingLists({
        title,
        address,
        value,
        data,
      });
      clearForm();
    } else {
      // get data from inputs
      const _data = methodToData();
      p.setPendingLists({
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
  }, [methods, data]);

  const _setMethodInput = (val: any, index: number) => {
    const _methodInputs = [...methodInputs];
    _methodInputs[index] = val;
    setMethodInputs(_methodInputs);
  };

  useEffect(() => {
    let _e = [...errors];
    let _newErrors = false;

    try {
      if (title && address && value) {
        if (inputType === "contract") {
          // Check to see if all inputs are filled
          const numberOfInputs = methods.filter(
            (a: ContractFunction) => a.name === methodSelected
          )[0].inputs.length;
          if (numberOfInputs === methodInputs.length) {
            if (!submittable) setSubmittable(true);
          } else if (submittable) {
            setSubmittable(false);
          }
        } else if (inputType === "data") {
          if (data) {
            if (!submittable) setSubmittable(true);
          } else if (submittable) {
            setSubmittable(false);
          }
        }
      }
      // Input specific errors
      if (address) {
        if (!web3.utils.isAddress(address)) {
          _e[1] = "Malformed address";
          setErrors(_e);
          _newErrors = true;
        } else {
          if (_e[1]) {
            _e[1] = undefined;
            setErrors(_e);
          }
        }
      }

      if (_newErrors) {
        setSubmittable(false);
      }
    } catch (e) { }

  }, [title, address, value, data, methodSelected, methodInputs]);

  return (
    <Fragment>
      <StyledButton
        disabled={p.disabled}
        type={p.addTx ? "primary" : "default"}
        onClick={() => setVisible(true)}
      >
        {p.addTx ? "Add Tx" : "New List"}
      </StyledButton>
      <Modal
        open={visible}
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
        <Error>{errors[1] || ""}</Error>
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
            autoSize={{ minRows: 10, maxRows: 20 }}
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
                {methods.map((m: ContractFunction) => {
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
                  .filter((a: ContractFunction) => a.name === methodSelected)[0]
                  .inputs.map((input: any, i: number) => {
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
}

export default NewListModal
