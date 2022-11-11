import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

import ProjectCard from "../components/project-card";
import { useFetchAllProjects } from "../hooks/projects";

const StyledHome = styled.div`
  margin-top: 64px;
`;
const StyledHeader = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
`;
const StyledSearch = styled(Input)`
  margin-top: 25px;
  background: #ffffff;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
  padding: 8px;
`;
const StyledSubheading = styled.div`
  margin-top: 16px;
  font-size: 14px;
  line-height: 19px;
`;

export default (props) => {
  const projects = useFetchAllProjects();

  return (
    <StyledHome>
      <StyledHeader>Governor</StyledHeader>
      <StyledSearch placeholder="Search" prefix={<SearchOutlined />} />
      <StyledSubheading>{projects.length} Projects</StyledSubheading>
      <Row style={{ marginTop: "32px" }}>
        {projects.map((p, i) => (
          <Col lg={6} md={8} sm={12} xs={24} key={i}>
            <ProjectCard
              icon={p.icon}
              name={p.name}
              address={p.governorAddress}
              chain={p.chain}
            />
          </Col>
        ))}
      </Row>
    </StyledHome>
  );
};
