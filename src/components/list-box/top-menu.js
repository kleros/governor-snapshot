import { Row, Col } from "antd";
import React from "react";
import styled from "styled-components";
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

export default ({
  listNumber,
  numberOfTxs,
  submittedAt,
  submitter,
  setShowHide,
}) => {
  return (
    <TopMenu onClick={setShowHide}>
      <Row>
        <Col lg={4}>List {listNumber}</Col>
        <Col lg={4} style={{ color: "#4D00B4" }}>
          {numberOfTxs} TXs
        </Col>
        <Col lg={6}>
          <Dot
            style={{
              backgroundColor: "#4D00B4",
              marginRight: "8px",
              marginBottom: "1px",
            }}
          />
          {submittedAt ? (
            <div>
              Submitted on{" "}
              {`${monthIndexToAbbrev(
                submittedAt.getUTCMonth()
              )} ${submittedAt.getUTCDate()}, ${submittedAt.getUTCFullYear()}`}
            </div>
          ) : (
            <div style={{ display: "inline-block" }}>Not submitted yet</div>
          )}
        </Col>
        <Col lg={10}>
          <div style={{ float: "right" }}>Submitter</div>
        </Col>
      </Row>
    </TopMenu>
  );
};
