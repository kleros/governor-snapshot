import { Row, Col, Button, Tooltip, Spin } from "antd";
import { LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSubmitPendingList } from "../../hooks/governor";
import { useFetchMethodsForContract } from "../../hooks/projects";
import NewTxModal from "../new-list-modal";
import Web3 from "web3";

const ListsContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  padding: 16px 0px;
  width: 97%;
  height: 97%;
  margin-bottom: 10px;
`;
const EnumeratedListsContainer = styled.div`
  height: 90%;
  overflow-y: scroll;
  max-height: 400px;
`;
const SubmitListsButton = styled(Button)`
  float: right;
  margin: 0px 20px;
`;

export default ({
  txs,
  submittable,
  submitter,
  governorContractInstance,
  chain,
  costPerTx,
  addToPendingLists,
  web3,
  abiCache,
  setAbiCache,
  onClear
}) => {
  const [selectedTx, setSelectedTx] = useState(1);
  const tx = txs[selectedTx - 1]
  const [decodedData, setDecodedData] = useState();
  const [_, abi, loading] = useFetchMethodsForContract(
    tx ? tx.address : '',
    chain
  );

  const _onClear = (index) => {
    setSelectedTx(1)
    onClear(index)
  }

  const useSubmitEmptyList = () => {
    governorContractInstance.methods.submitList([], [], '0x', [], '').send({
      from: submitter,
      value: costPerTx
    })
  }

  useEffect(() => {
    if (loading) {
      setDecodedData(<Spin indicator={<LoadingOutlined />} />);
    } else {
      let methodName;
      let parameters;
      for (let i = 0; i < abi.length; i++) {
        if (abi[i].name && !abi[i].constant) {
          const methodSig = web3.eth.abi.encodeFunctionSignature(abi[i]);
          if (tx.data.substring(0, 10) === methodSig) {
            const _parameters = abi[i].inputs.length
              ? web3.eth.abi.decodeParameters(
                  abi[i].inputs,
                  tx.data.substring(10, tx.data.length)
                )
              : {};
            parameters = Object.keys(_parameters)
              .splice(abi[i].inputs.length + 1, abi[i].inputs.length * 2)
              .map((k) => `${k} : ${_parameters[k]}`);
            methodName = abi[i].name;
            break;
          }
        }
      }
      if (methodName) setDecodedData(`${methodName}(${parameters})`);
      else {
        if (tx) {
          setDecodedData(
            <Tooltip title={"ABI must be verified on the block explorer"}>
              Not available <InfoCircleOutlined />
            </Tooltip>
          );
        } else {
          setDecodedData(undefined)
        }
      }

    }
  }, [abi, selectedTx, loading]);

  return (
    <Row>
      <Col lg={16} xs={24}>
        <ListsContainer>
          <EnumeratedListsContainer>
            {txs.map((tx, i) => {
              return (
                <TxRow
                  key={i}
                  title={tx.title}
                  txNumber={i + 1}
                  selected={i + 1 === selectedTx}
                  onClick={setSelectedTx}
                  onClear={_onClear}
                  submittable={submittable}
                />
              );
            })}
          </EnumeratedListsContainer>
          {submittable ? (
            <div>
              <SubmitListsButton
                type="primary"
                onClick={() => {
                  if (txs.length)
                    useSubmitPendingList(
                      txs,
                      governorContractInstance,
                      chain,
                      costPerTx,
                      submitter
                    );
                  else
                    useSubmitEmptyList()
                }}
              >
                <Tooltip title="This deposit will be returned if your list is executed. Deposit can be lost in the event of a dispute.">{`Submit List with ${Web3.utils.fromWei(
                  String(costPerTx)
                )} ETH Deposit`}</Tooltip>
              </SubmitListsButton>
              <NewTxModal
                setPendingLists={addToPendingLists}
                addTx={true}
                web3={web3}
                governorContractInstance={governorContractInstance}
                chain={chain}
                costPerTx={costPerTx}
              />
            </div>
          ) : (
            ""
          )}
        </ListsContainer>
      </Col>
      <Col lg={8}>
        <ListBreakdownBox
          header={"Contract Address"}
          content={tx ? tx.address : ''}
        />
        <ListBreakdownBox
          header={"Value"}
          content={tx ? tx.value : ''}
        />
        <ListBreakdownBox
          header={"Data Input"}
          content={tx ? tx.data : ''}
        />
        <ListBreakdownBox
          header={"Decoded Contract Input"}
          content={decodedData}
        />
      </Col>
    </Row>
  );
};

/*
 * Tx Row
 */

const StyledTxRow = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  padding: 16px 7px;

  &:hover {
    color: #000;
    font-weight: 600;
  }
`;

const TxRowSelected = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 22px;
  padding: 16px 7px;

  background: rgba(0, 154, 255, 0.06);
  border-left: 4px solid #009aff;
`;
const ClearX = styled.div`
  float: right;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.4);
  margin-right: 5px;
`

const TxRow = ({ title, txNumber, selected, onClick, onClear, submittable }) => {
  const _text = `Tx${txNumber}: ${title}`;

  if (selected) return <TxRowSelected>{_text} {submittable ? (<ClearX onClick={() => onClear(txNumber - 1)}>x</ClearX>) : ''}</TxRowSelected>;
  else
    return (
      <StyledTxRow
        onClick={() => {
          onClick(txNumber);
        }}
      >
        {_text}
      </StyledTxRow>
    );
};

/*
 * List Breakdown Containers
 */
const ListBreakdownContainer = styled.div`
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  background: #fff;
  margin-bottom: 10px;
`;
const ListBreakdownHeader = styled.div`
  background: #4d00b4;
  border-radius: 3px;
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  padding: 10px 27px;
  overflow-wrap: break-word;
`;
const ListBreakdownContent = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.45);
  background: #fff;
  padding: 10px 27px;
  overflow-wrap: break-word;
`;

const ListBreakdownBox = ({ header, content }) => {
  return (
    <ListBreakdownContainer>
      <ListBreakdownHeader>{header}</ListBreakdownHeader>
      <ListBreakdownContent>{content || (<br />)}</ListBreakdownContent>
    </ListBreakdownContainer>
  );
};
