import { Row, Col } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

const StyledDisputeBanner = styled.div`
  border: 1px solid #009aff;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 25px 24px;
`;
const Heading = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #009aff;
`;
const Subtext = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;
const StyledInfoCol = styled(Col)`
  color: #009aff;
  font-size: 24px;
  line-height: 34px;
`;

const DisputeBanner: React.FC = () => {
  return (
    <StyledDisputeBanner>
      <Row>
        <StyledInfoCol lg={2}>
          <InfoCircleOutlined />
        </StyledInfoCol>
        <Col lg={22}>
          <Heading>
            A dispute was created. Jurors are evaluating the case.
          </Heading>
          <Subtext>A decision will be announced soon.</Subtext>
        </Col>
      </Row>
    </StyledDisputeBanner>
  );
}

export default DisputeBanner;
