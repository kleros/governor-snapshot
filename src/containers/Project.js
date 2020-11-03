import { Col, Row } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import React from "react";
import styled from 'styled-components'
import { Link } from "react-router-dom";
import InfoBanner from '../components/info-banner'
import GovernorInterface from '../constants/abis/governor.json'
import { useFetchProjectByName } from "../hooks/projects";
import { capitalizeString } from "../util/text"

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
  color: #009AFF;
  cursor: pointer;
`

export default (props) => {
  const { match: { params } } = props;
  const projectInfo = useFetchProjectByName(params.projectName)
  const governorContractInstance = new props.web3.eth.Contract(
    GovernorInterface.abi,
    projectInfo.governorAddress,
  )

  return (
    <StyledProjectHome>
      <Row>
        <Col lg={20}>
          <StyledHeader>
            <Link to="/">Governor</Link>
            {<span style={{fontWeight: '300'}}> / { projectInfo.icon }{capitalizeString(params.projectName)}</span>}
          </StyledHeader>
        </Col>
        <Col lg={4}>
          <LinkText style={{float: 'right', lineHeight: '36px'}}>
            How it works
            <InfoCircleOutlined style={{marginLeft: "5px"}}/>
          </LinkText>
        </Col>
      </Row>
      <InfoBanner governorContractInstance={governorContractInstance} />
    </StyledProjectHome>
  );
}
