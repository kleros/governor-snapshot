import { Col, Row, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import InfoBanner from "../components/info-banner";
import NewListModal from "../components/new-list-modal";
import ListViewer from "../components/list-viewer";
import GovernorInterface from "../constants/abis/governor.json";
import { useFetchProjectByName } from "../hooks/projects";
import { capitalizeString } from "../util/text";

const Dot = styled.div`
  height: 8px;
  width: 8px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
`;

const StyledProjectHome = styled.div`
  margin-top: 64px;
`;
const StyledHeader = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;

  a {
    color: #000;
  }

  svg {
    height: 18px;
    width: 18px;
    margin-right: 5px;
  }
`;
const LinkText = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #009aff;
  cursor: pointer;
`;
const ListOptionsRow = styled(Row)`
  margin: 35px 0px;
`;
const StyledSelect = styled(Select)`
  background: #ffffff;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
  min-width: 220px;
`;

export default (props) => {
  const {
    match: { params },
  } = props;
  const [listsShown, setListsShown] = useState("current");

  const projectInfo = useFetchProjectByName(params.projectName);
  const governorContractInstance = new props.web3.eth.Contract(
    GovernorInterface.abi,
    projectInfo.governorAddress
  );

  return (
    <StyledProjectHome>
      <Row>
        <Col lg={20} md={18} sm={18} xs={16}>
          <StyledHeader>
            <Link to="/">Governor</Link>
            {
              <span style={{ fontWeight: "300" }}>
                {" "}
                / {projectInfo.icon}
                {capitalizeString(params.projectName)}
              </span>
            }
          </StyledHeader>
        </Col>
        <Col lg={4} md={6} sm={6} xs={8}>
          <LinkText style={{ float: "right", lineHeight: "36px" }}>
            How it works
            <InfoCircleOutlined style={{ marginLeft: "5px" }} />
          </LinkText>
        </Col>
      </Row>
      <InfoBanner
        governorContractInstance={governorContractInstance}
        web3={props.web3}
      />
      <ListOptionsRow>
        <Col lg={20} md={12} sm={12} xs={12}>
          <StyledSelect onChange={setListsShown} defaultValue="current">
            <Select.Option value="current">
              <span>
                <Dot
                  style={{
                    backgroundColor: "#009AFF",
                    marginRight: "8px",
                    marginBottom: "1px",
                  }}
                />
                Current Lists
              </span>
            </Select.Option>
            <Select.Option value="executed">
              <span>
                <Dot
                  style={{
                    backgroundColor: "#00C42B",
                    marginRight: "8px",
                    marginBottom: "1px",
                  }}
                />
                Executed Lists
              </span>
            </Select.Option>
          </StyledSelect>
        </Col>
        <Col lg={4} md={12} sm={12} xs={12}>
          <NewListModal />
        </Col>
      </ListOptionsRow>
      <ListViewer governorContractInstance={governorContractInstance} />
    </StyledProjectHome>
  );
};
