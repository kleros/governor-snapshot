import { Row, Col } from "antd";
import makeBlockie from "ethereum-blockies-base64";
import { Contract } from "web3-eth-contract"
import React from "react";
import styled from "styled-components";
import { useFetchSubmissionHash } from "../../hooks/governor";
import { Chain } from "../../types";
import { monthIndexToAbbrev } from "../../util/text";

const StyledTopMenu = styled.div`
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
    margin-bottom: 5px;
  }
`;
const WithdrawList = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #009aff;
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;
`;

const TopMenu: React.FC<{
  listNumber: string,
  numberOfTxs: number,
  submittedAt?: Date,
  submitter: string,
  setShowHide: React.MouseEventHandler,
  withdrawable: boolean,
  governorContractInstance: Contract,
  chain: Chain,
  account: string,
}> = (p) => {
  const submissionHash = useFetchSubmissionHash(
    p.governorContractInstance,
    p.listNumber
  );

  const sendWithdrawSubmission = () => {
    p.governorContractInstance.methods
      .withdrawTransactionList(p.listNumber, submissionHash)
      .send({
        from: p.account,
      });
  };

  return (
    <StyledTopMenu onClick={p.setShowHide}>
      <Row>
        <Col lg={3} md={4} sm={4} xs={12}>
          List {p.listNumber}
        </Col>
        <Col lg={3} md={4} sm={4} xs={12} style={{ color: "#4D00B4" }}>
          {p.numberOfTxs} TXs
        </Col>
        <Col lg={12} md={10} sm={16} xs={24}>
          <Dot
            style={{
              backgroundColor: "#4D00B4",
              marginRight: "8px",
              marginBottom: "1px",
            }}
          />
          {p.submittedAt ? (
            <div style={{ display: "inline-block" }}>
              Submitted on{" "}
              {`${monthIndexToAbbrev(
                p.submittedAt.getUTCMonth()
              )} ${p.submittedAt.getUTCDate()}, ${p.submittedAt.getUTCFullYear()}`}
              {p.withdrawable ? (
                <WithdrawList
                  onClick={(event) => {
                    event.stopPropagation();
                    sendWithdrawSubmission();
                  }}
                  style={{ marginLeft: "20px" }}
                >
                  Withdraw List
                </WithdrawList>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div style={{ display: "inline-block" }}>Not submitted yet</div>
          )}
        </Col>
        <Col lg={6} md={6} sm={0} xs={0}>
          <div style={{ float: "right" }}>
            Submitter
            <Identicon
              href={p.chain.scanAddressUrl(p.submitter)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.submitter ? <img src={makeBlockie(p.submitter)} alt={""} /> : ""}
            </Identicon>
          </div>
        </Col>
      </Row>
    </StyledTopMenu>
  );
}

export default TopMenu;
