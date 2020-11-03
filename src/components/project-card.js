import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as EtherscanLogo } from "../assets/logos/etherscan.svg";
import { capitalizeString } from "../util/text"

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
const EtherscanLink = styled.a`
  float: right;
  margin: 10px;
`

export default ({ icon, name, address }) => {
  return (
    <CardFragment>
      <Link to={`/${name}`}>
        <ProjectCard>
          {icon}
          <ProjectName>
            {capitalizeString(name)}
          </ProjectName>
        </ProjectCard>
      </Link>
      <ProjectFooter>
        <EtherscanLink
          target="_blank"
          rel="noopener noreferrer"
          href={`https://etherscan.io/address/${address}#code`}>
          <EtherscanLogo />
        </EtherscanLink>
      </ProjectFooter>
    </CardFragment>
  );
};
