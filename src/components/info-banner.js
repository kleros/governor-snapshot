import { Row, Col, Button } from "antd";
import React from "react";
import styled from "styled-components";
import { useFetchSessionStart, useFetchSessionEnd } from "../hooks/governor";
import { useFetchAccount } from "../hooks/account";
import { monthIndexToAbbrev } from "../util/text";
import TimeAgo from "./time-ago";

const InfoBanner = styled.div`
  background: #fbf9fe;
  border-top: 2px solid #4d00b4;
  border-radius: 3px;
  color: #4d00b4;
  font-size: 14px;
  line-height: 22px;
  padding: 23px 32px;
  margin-top: 24px;
`;
const SessionEndText = styled.div`
  text-align: center;
  float: right;
`;
const StyledTimeAgo = styled(TimeAgo)`
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
`;

export default ({ governorContractInstance, web3 }) => {
  const account = useFetchAccount(web3);
  const sessionStart = useFetchSessionStart(governorContractInstance);
  const sessionEnd = useFetchSessionEnd(governorContractInstance);

  const sendExecuteSubmissions = governorContractInstance.methods.executeSubmissions();
  return (
    <InfoBanner>
      <Row>
        <Col lg={18} md={12} sm={10}>
          <span>
            Governor decision from{" "}
            <a href={`https://snapshot.page/#/`}>Snapshot.</a>
          </span>
          <br />
          <span>
            <b>Session:</b> Votes approved before{" "}
            {sessionStart &&
              `${monthIndexToAbbrev(
                sessionStart.getUTCMonth()
              )} ${sessionStart.getUTCDate()}, ${sessionStart.getUTCFullYear()} - ${sessionStart.getUTCHours()}h ${sessionStart.getUTCMinutes()}m`}
          </span>
        </Col>
        <Col lg={6} md={12} sm={14}>
          {Number(sessionEnd.getTime()) < Number(new Date().getTime()) ? (
            <Button
              disabled={!account}
              type="primary"
              onClick={() =>
                sendExecuteSubmissions.send({
                  from: account,
                })
              }
            >
              Execute Submissions
            </Button>
          ) : (
            <SessionEndText>
              List submission in <br />
              <StyledTimeAgo date={sessionEnd || new Date()} />
            </SessionEndText>
          )}
        </Col>
      </Row>
    </InfoBanner>
  );
};
