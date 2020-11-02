import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

import ProjectCard from "../components/ProjectCard";
import { useFetchProjects } from "../hooks/projects";

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
  const projects = useFetchProjects();

  return (
    <StyledHome>
      <StyledHeader>Governor</StyledHeader>
      <StyledSearch placeholder="Search" prefix={<SearchOutlined />} />
      <StyledSubheading>{projects.length} Projects</StyledSubheading>
      <Row style={{ marginTop: "32px" }}>
        {projects.map((p) => (
          <Col lg={6}>
            <ProjectCard icon={p.icon} name={p.name} />
          </Col>
        ))}
      </Row>
    </StyledHome>
  );
};
