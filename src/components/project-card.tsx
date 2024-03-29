import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Chain } from "../types";
import { capitalizeString } from "../util/text";

const CardFragment = styled.div`
  margin: 15px 10px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 28px rgba(77, 0, 180, 0.25);
  cursor: pointer;

  &:hover {
    box-shadow: 0px 6px 8px rgba(77, 0, 180, 0.25);
  }
`;
const StyledProjectCard = styled.div`
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
const EtherscanLink = styled.a`
  float: right;
  margin: 10px;
`;

const ProjectCard: React.FC<{
  icon: ReactNode,
  name: string,
  address: string,
  chain: Chain
}> = (p) => {
  return (
    <CardFragment>
      <Link to={`/${p.name}`}>
        <StyledProjectCard>
          {p.icon}
          <ProjectName>{capitalizeString(p.name)}</ProjectName>
        </StyledProjectCard>
      </Link>
      <ProjectFooter>
        <EtherscanLink
          target="_blank"
          rel="noopener noreferrer"
          href={p.chain.scanContractUrl(p.address)}
        >
          {p.chain.icon}
        </EtherscanLink>
      </ProjectFooter>
    </CardFragment>
  );
}

export default ProjectCard;
