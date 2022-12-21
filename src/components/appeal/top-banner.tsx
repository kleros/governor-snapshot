import { Col, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState, Fragment } from "react";
import styled from "styled-components";

const StyledTopBanner = styled.div`
  background: #4d00b4;
  border-radius: 3px;
  padding: 10px 32px;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  cursor: pointer;
`;

const TopBanner: React.FC<{ children: any }> = (p) => {
  const [show, setShow] = useState(true);
  return (
    <Fragment>
      <StyledTopBanner onClick={() => setShow(!show)}>
        <Row>
          <Col lg={20}>Appeal</Col>
          <Col lg={4}>
            {show ? (
              <MinusOutlined style={{ float: "right" }} />
            ) : (
              <PlusOutlined style={{ float: "right" }} />
            )}
          </Col>
        </Row>
      </StyledTopBanner>
      {show ? <Fragment>{p.children}</Fragment> : ""}
    </Fragment>
  );
}

export default TopBanner;
