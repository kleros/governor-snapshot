import { Row, Col } from "antd";
import makeBlockie from 'ethereum-blockies-base64';
import React from "react";
import styled from "styled-components";
import { useFetchSubmissionHash } from '../../hooks/governor'
import { monthIndexToAbbrev } from "../../util/text";

const TopMenu = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 24px;
  padding: 19px 32px;

  &:hover {
    box-shadow: 0px 6px 8px rgba(77, 0, 180, 0.25);
  }
`;
const Dot = styled.div`
  height: 8px;
  width: 8px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
`;
const Identicon = styled.a`
  margin-left: 10px;
  img {
    height: 22px;
    border-radius: 22px;
    vertical-align: middle;
    margin-bottom: 5px
  }
`
const WithdrawList = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #009AFF;
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;
`

export default ({
  listNumber,
  numberOfTxs,
  submittedAt,
  submitter,
  setShowHide,
  withdrawable,
  governorContractInstance,
  account
}) => {
  const submissionHash = useFetchSubmissionHash(governorContractInstance, listNumber);
  console.log(submissionHash)

  const sendWithdrawSubmission = () => {
    governorContractInstance.methods.withdrawTransactionList(
      listNumber,
      submissionHash
    ).send({
      from: account
    })
  }

  return (
    <TopMenu onClick={setShowHide}>
      <Row>
        <Col lg={3} md={4} sm={4} xs={12}>List {listNumber}</Col>
        <Col lg={3} md={4} sm={4} xs={12} style={{ color: "#4D00B4" }}>
          {numberOfTxs} TXs
        </Col>
        <Col lg={12} md={10} sm={16} xs={24}>
          <Dot
            style={{
              backgroundColor: "#4D00B4",
              marginRight: "8px",
              marginBottom: "1px",
            }}
          />
          {submittedAt ? (
            <div style={{ display: "inline-block" }}>
              Submitted on{" "}
              {`${monthIndexToAbbrev(
                submittedAt.getUTCMonth()
              )} ${submittedAt.getUTCDate()}, ${submittedAt.getUTCFullYear()}`}
              {
                withdrawable ? (
                  <WithdrawList onClick={sendWithdrawSubmission} style={{marginLeft: '20px'}}>Withdraw List</WithdrawList>
                ) : ''
              }
            </div>
          ) : (
            <div style={{ display: "inline-block" }}>Not submitted yet</div>
          )}
        </Col>
        <Col lg={6} md={6} sm={0} xs={0}>
          <div style={{ float: "right" }}>
            Submitter
            <Identicon
              href={`https://etherscan.io/address/${submitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {
                submitter ? (
                  <img src={makeBlockie(submitter)} />
                ) : ''
              }
            </Identicon>
          </div>
        </Col>
      </Row>
    </TopMenu>
  );
};
