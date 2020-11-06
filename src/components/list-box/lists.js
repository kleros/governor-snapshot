import { Row, Col, Button } from "antd";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { useSubmitPendingList } from "../../hooks/governor";
import NewTxModal from "../new-list-modal";

const ListsContainer = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  padding: 16px 0px;
  width: 97%;
  height: 100%;
  margin-bottom: 10px;
`;
const EnumeratedListsContainer = styled.div`
  height: 90%;
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
  costPerTx,
  addToPendingLists,
}) => {
  const [selectedTx, setSelectedTx] = useState(1);

  return (
    <Row>
      <Col lg={16}>
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
                />
              );
            })}
          </EnumeratedListsContainer>
          {submittable ? (
            <div>
              <SubmitListsButton
                type="primary"
                onClick={() => {
                  useSubmitPendingList(
                    txs,
                    governorContractInstance,
                    costPerTx,
                    submitter
                  );
                }}
              >
                Submit List with {costPerTx} ETH Deposit
              </SubmitListsButton>
              <NewTxModal setPendingLists={addToPendingLists} addTx={true} />
            </div>
          ) : (
            ""
          )}
        </ListsContainer>
      </Col>
      <Col lg={8}>
        <ListBreakdownBox
          header={"Contract Address"}
          content={txs[selectedTx - 1].address}
        />
        <ListBreakdownBox
          header={"Value"}
          content={txs[selectedTx - 1].value}
        />
        <ListBreakdownBox
          header={"Data Input"}
          content={txs[selectedTx - 1].data}
        />
        <ListBreakdownBox
          header={"Decoded Contract Input"}
          content={txs[selectedTx - 1].decodedData}
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

const TxRow = ({ title, txNumber, selected, onClick }) => {
  const _text = `Tx${txNumber}: ${title}`;

  if (selected) return <TxRowSelected>{_text}</TxRowSelected>;
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
      <ListBreakdownContent>{content || "Not Available"}</ListBreakdownContent>
    </ListBreakdownContainer>
  );
};
