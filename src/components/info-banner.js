import { Row, Col, Button } from "antd";
import React, { Fragment } from "react";
import styled from "styled-components";
import { useFetchSessionStart, useFetchSessionEnd, useFetchSession } from "../hooks/governor";
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

export default ({ governorContractInstance, account }) => {
  const sessionStart = useFetchSessionStart(governorContractInstance);
  const sessionEnd = useFetchSessionEnd(governorContractInstance);
  const session = useFetchSession(governorContractInstance);

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
            <Fragment>
              {
                session && session.disputeID ? (
                  <div />
                ) : (
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
                )
              }

            </Fragment>
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
