import { Row, Col } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";
import TimeAgo from "./time-ago";

const StyledWithdrawBanner = styled.div`
  border: 1px solid #ff9900;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 25px 24px;
  margin-bottom: 20px;
`;
const Heading = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #ff9900;
`;
const Subtext = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;
const StyledInfoCol = styled(Col)`
  color: #ff9900;
  font-size: 24px;
  line-height: 34px;
`;

const WithdrawBanner: React.FC<{
  timeout: Date
}> = (p) => {
  return (
    <StyledWithdrawBanner>
      <Row>
        <StyledInfoCol lg={2}>
          <InfoCircleOutlined />
        </StyledInfoCol>
        <Col lg={22}>
          <Heading>
            The list has been submitted. Withdrawl timeout:{" "}
            <TimeAgo date={p.timeout || new Date()} />
          </Heading>
          <Subtext>
            If you notice someone has posted a similar list or you spot a
            mistake, withdraw your list in order to avoid a dispute.
          </Subtext>
        </Col>
      </Row>
    </StyledWithdrawBanner>
  );
}

export default WithdrawBanner;
