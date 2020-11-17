import { Col, Row, Progress, Input } from "antd";
import { HourglassOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";
import makeBlockie from "ethereum-blockies-base64";
import TimeAgo from "../time-ago";
import { shortenEthAddress } from "../../util/text";
import BlueBanner from "../blue-banner";
import Web3 from "web3";

const StyledAppealSideBox = styled.div`
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  padding: 24px;
  width: 97%;
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
const ClaimedHeading = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;
const ClaimedContainer = styled.div`
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
  padding: 8px 16px;
  margin-top: 10px;
`;
const AmountRequired = styled.div`
  margin-top: 24px;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
`;

export default ({
  winner,
  listID,
  submissionIndex,
  submitter,
  deadline,
  appealFee,
  amountContributed,
  rewardPercentage,
  governorContractInstance,
  account,
}) => {
  const amountRemaining = Web3.utils.fromWei(
    (Number(appealFee || 0) - Number(amountContributed || 0)).toString()
  );
  const onFund = (amount) => {
    governorContractInstance.methods.fundAppeal(submissionIndex).send({
      from: account,
      value: Web3.utils.toWei(amount).toString(),
    });
  };

  return (
    <StyledAppealSideBox>
      <Row>
        <Col lg={3}>
          <Identicon
            href={`https://etherscan.io/address/${submitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {submitter ? (
              <img src={makeBlockie(submitter)} alt={submitter} />
            ) : (
              ""
            )}
          </Identicon>
        </Col>
        <Col lg={21}>
          {shortenEthAddress(submitter)}
          <div>{winner ? "Previous round winner" : "Previous round loser"}</div>
        </Col>
      </Row>
      <ClaimedHeading> Claimed </ClaimedHeading>
      <ClaimedContainer> Enforce List {listID} </ClaimedContainer>
      <AmountRequired>Deposit Required = {amountRemaining} ETH</AmountRequired>
      <Progress
        percent={((Number(amountRemaining) / Number(appealFee)) * 100).toFixed(
          0
        )}
        style={{ marginTop: "25px" }}
      />
      <HourglassOutlined style={{ margin: "5px" }} />
      <TimeAgo date={deadline} />
      <Input.Search
        placeholder="ETH"
        allowClear
        enterButton="Fund"
        size="large"
        disabled={
          ((Number(amountRemaining) / Number(appealFee)) * 100).toFixed(0) ===
          "100"
        }
        style={{ marginTop: "25px" }}
        onSearch={onFund}
      />
      <BlueBanner
        heading="For external contributors"
        subtext={`If this list wins, you will recieve your deposit back in addition to a ${rewardPercentage}% reward.`}
        style={{ marginTop: "25px" }}
      />
    </StyledAppealSideBox>
  );
};
