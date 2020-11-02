import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CardFragment = styled.div`
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  cursor: pointer;

  &:hover {
    box-shadow: 0px 6px 16px rgba(77, 0, 180, 0.25);
  }
`;
const ProjectCard = styled.div`
  padding: 37px 37px 20px 37px;
  text-align: center;
`;
const ProjectName = styled.div`
  font-size: 14px;
  line-height: 19px;
  margin-top: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
`;
const ProjectFooter = styled.div`
  background: #fbf9fe;
  height: 40px;
  width: 100%;
`;

export default ({ icon, name }) => {
  return (
    <CardFragment>
      <Link to={`/${name}`}>
        <ProjectCard>
          {icon}
          <ProjectName>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </ProjectName>
        </ProjectCard>
        <ProjectFooter />
      </Link>
    </CardFragment>
  );
};
