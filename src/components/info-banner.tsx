import { Row, Col, Button } from "antd";
import React, { Fragment } from "react";
import styled from "styled-components";
import {
  useFetchSessionStart,
  useFetchSessionEnd,
  useFetchSession,
} from "../hooks/governor";
import { monthIndexToAbbrev } from "../util/text";
import TimeAgo from "./time-ago";
import SnapshotLogo from "../assets/logos/snapshot.png";
import { Contract } from "web3-eth-contract";
import { Session } from "../types";

const StyledInfoBanner = styled.div`
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

const InfoBanner: React.FC<{
  governorContractInstance: Contract;
  account: string;
  session: Session;
  snapshotSlug: string;
  showTimeout: boolean;
}> = (p) => {
  const sessionStart = useFetchSessionStart(p.governorContractInstance);
  const sessionEnd = useFetchSessionEnd(
    p.governorContractInstance,
    p.session.currentSessionNumber
  );
  const session = useFetchSession(p.governorContractInstance);

  const sendExecuteSubmissions = p.governorContractInstance.methods.executeSubmissions();

  return (
    <StyledInfoBanner>
      <Row>
        <Col lg={18} md={12} sm={10}>
          <span>
            Governor decision from{" "}
            <img src={SnapshotLogo} style={{ height: "16px" }} />
            <a href={`https://snapshot.org/#/${p.snapshotSlug}`}>Snapshot.</a>
          </span>
          <br />
          <span>
            <b>Session:</b> Votes approved before{" "}
            {sessionStart.getTime() !== 0 &&
              `${monthIndexToAbbrev(
                sessionStart.getUTCMonth()
              )} ${sessionStart.getUTCDate()}, ${sessionStart.getUTCFullYear()} - ${sessionStart.getUTCHours()}h ${sessionStart.getUTCMinutes()}m`}
          </span>
        </Col>
        <Col lg={6} md={12} sm={14}>
          {Number(sessionEnd.getTime()) < Number(new Date().getTime()) ? (
            <Fragment>
              {p.session && Number(p.session.disputeID) ? (
                <div />
              ) : (
                <Button
                  // executeSubmissions is gated by two things:
                  // duringApprovalPeriod
                  // not in dispute
                  disabled={
                    !(
                      new Date().getTime() > sessionEnd.getTime() &&
                      session.status == 0
                    )
                  }
                  type="primary"
                  onClick={() => {
                    sendExecuteSubmissions.send({
                      from: p.account,
                    });
                  }}
                >
                  Execute Submissions
                </Button>
              )}
            </Fragment>
          ) : (
            <Fragment>
              {p.showTimeout ? (
                <SessionEndText>
                  Session ends <br />
                  <StyledTimeAgo
                    date={sessionEnd.getTime() !== 0 ? sessionEnd : new Date()}
                  />
                </SessionEndText>
              ) : (
                ""
              )}
            </Fragment>
          )}
        </Col>
      </Row>
    </StyledInfoBanner>
  );
};

export default InfoBanner;
