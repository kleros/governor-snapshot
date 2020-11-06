import { Button, Modal, Input, Radio } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import { useFetchMethodsForContract } from '../hooks/projects'
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
`
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
`
const StyledRadioOption = styled(Radio)`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`
const StyledSubmit = styled(Button)`
  margin: 20px 0px;
`

export default ({ setPendingLists, disabled }) => {
  const [ visible, setVisible ] = useState(false);
  const [ inputType, setInputType ] = useState('data')
  const [ title, setTitle ] = useState()
  const [ address, setAddress ] = useState()
  const [ value, setValue ] = useState()
  const [ data, setData ] = useState()
  const [ submittable, setSubmittable ] = useState(false)
  const methods = useFetchMethodsForContract(address)

  useEffect(() => {
    if (methods.length && !data)
      setInputType('contract')
  }, [methods])

  useEffect(() => {
    if (title && address && value && data) {
      if (!submittable)
        setSubmittable(true)
    } else {
      if (submittable)
        setSubmittable(false)
    }
  }, [title, address, value, data])

  return (
    <Fragment>
      <StyledButton disabled={disabled} type="primary" onClick={() => setVisible(true)}>
        New List
      </StyledButton>
      <Modal visible={visible} maskClosable onCancel={() => setVisible(false)} footer={null}>
        <InputHeader>Add TX to the List</InputHeader>
        <InputLabel>Title</InputLabel>
        <Input placeholder={"eg. Update Non Technical Juror Fee"} onChange={(e) => setTitle(e.target.value)} />
        <InputLabel>Contract Address</InputLabel>
        <Input placeholder={"eg. 0x60B2AbfDfaD9c0873242f59f2A8c32A3Cc682f80"} onChange={(e) => setAddress(e.target.value)} />
        <InputLabel onChange={(e) => setValue(e.target.value)}>Value</InputLabel>
        <Input placeholder={"eg. 0"} />
        <Radio.Group style={{margin: "25px 0px"}} onChange={(e) => setInputType(e.target.value)} value={inputType}>
          <StyledRadioOption value={'data'}>Data Input</StyledRadioOption>
          <StyledRadioOption disabled={!methods.length} value={'contract'}>Contract Input</StyledRadioOption>
        </Radio.Group>
        {
          inputType === 'data' ? (
            <StyledTextArea
              autosize={{ minRows: 10, maxRows: 20 }}
              allowClear={true}
              value={data}
              placeholder={"0x85c855f3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000032d26d12e980b600000)"}
              onChange={(e) => setData(e.target.value)}
            />
          ) : (
            <div>placeholder</div>
          )
        }
        <StyledSubmit
          type="primary"
          disabled={!submittable}
          onClick={() => {
            setPendingLists([
              {
                title,
                address,
                value,
                data
              }
            ])
            setVisible(false)
          }}
        >
          Submit
        </StyledSubmit>
      </Modal>
    </Fragment>
  );
};
