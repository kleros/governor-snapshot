import { Col, Row } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import TimeAgo from "./time-ago";
import PolicyRegistryInterface from "../constants/abis/policy-registry.json";
import { useFetchDispute, useFetchPeriodTimes, useFetchDisputeInfo } from '../hooks/arbitrator'
import { useFetchSubcourt } from '../hooks/policy-registry'

const DisputeContainer = styled.div`
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 18px;
  padding: 51px 33px;
  margin-top: 32px;
`

const PeriodNumber = styled.div`
  border-radius: 50%;
  width: 25px;
  background: ${props => props.selected ? '#009AFF' : '#fff'};
  border: 1px solid ${props => props.selected ? '#009AFF' : '#CCCCCC'};
  color: ${props => props.selected ? '#fff' : '#CCCCCC'};
  text-align: center;
`
const PeriodHeading = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${props => props.selected ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)'};
  display:
`
const PeriodTime = styled(TimeAgo)`
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.selected ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)'};
`
const PeriodText = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.selected ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.45)'};
`
const FillLine = styled.div`
  border-bottom: 1px solid #CCCCCC;
  width: 100%;
  position: relative;
  top: 10px;
`
const PurpleDivider = styled.div`
  border-bottom: 2px solid #4D00B4;
  margin: 35px 0px;
  width: 100%;
`
const DisputeItemBox = styled.div`
  background: #FFFFFF;
  cursor: pointer;
  margin-top: 10px;
  padding: 8px 15px;
  box-shadow: 0px 6px 24px rgba(77, 0, 180, 0.25);
  border-radius: 3px;
`

const formatEstimateTime = (seconds) => {
  const days = Math.floor(seconds/86400.0)
  const hours = Math.floor((seconds - (days*86400)) / 3600)
  const minutes = Math.floor((seconds - (days*86400) - hours * 3600) / 60)

  return days ? (
    `${days} days`
  ) : (
    hours ? (
      `${hours} hours`
    ) : (
      `${minutes} minutes`
    )
  )
}

export default ({ disputeID, arbitratorContractInstance, web3, projectInfo }) => {
  const dispute = useFetchDispute(arbitratorContractInstance, disputeID)
  const disputeInfo = useFetchDisputeInfo(arbitratorContractInstance, disputeID)
  const periodTimes = useFetchPeriodTimes(arbitratorContractInstance, dispute.subcourtID || 0)
  const timeoutDate = new Date(
    new Date((Number(dispute.lastPeriodChange || 0) + Number(periodTimes[dispute.period] || 0)) * 1000)
  )

  const policyRegistryInstance = new web3.eth.Contract(
    PolicyRegistryInterface.abi,
    projectInfo.policyRegistryAddress
  )
  const subcourtInfo = useFetchSubcourt(policyRegistryInstance, dispute.subcourtID || 0)

  return (
    <DisputeContainer>
      <Row>
        <Col lg={10} md={10} sm={8} xs={8}>
          <Row>
            <Col lg={3} md={4} sm={5} xs={24}>
              <PeriodNumber selected={dispute.period === "0"}>
                1
              </PeriodNumber>
            </Col>
            <Col lg={10} md={10} sm={19}>
              <PeriodHeading selected={dispute.period === "0"}>Evidence Period</PeriodHeading>
                {
                  dispute.period === "0" ? (
                    <PeriodTime selected={true} date={timeoutDate < new Date() ? new Date() : timeoutDate} />
                  ) : (
                    <PeriodText>{formatEstimateTime(periodTimes[0])}</PeriodText>
                  )
                }
            </Col>
            <Col lg={10} md={8} sm={0}>
              <FillLine />
            </Col>
          </Row>
        </Col>
        <Col lg={10} md={10} sm={8} xs={8}>
          <Row>
            <Col lg={3} md={4} sm={5} xs={24}>
              <PeriodNumber selected={dispute.period === "1"}>
                2
              </PeriodNumber>
            </Col>
            <Col lg={10} md={10} sm={19}>
              <PeriodHeading selected={dispute.period === "1"}>Vote Period</PeriodHeading>
              {
                dispute.period === "1" ? (
                  <PeriodTime selected={true} date={timeoutDate < new Date() ? new Date() : timeoutDate} />
                ) : (
                  <PeriodText>{formatEstimateTime(periodTimes[1])}</PeriodText>
                )
              }
            </Col>
            <Col lg={10} md={8} sm={0}>
              <FillLine />
            </Col>
          </Row>
        </Col>
        <Col lg={4} md={4} sm={8} xs={8}>
          <Row>
            <Col lg={6} md={7} sm={5} xs={24}>
              <PeriodNumber selected={dispute.period === "2"}>
                3
              </PeriodNumber>
            </Col>
            <Col lg={18} md={17} sm={19}>
              <PeriodHeading selected={dispute.period === "2"}>Appeal Period</PeriodHeading>
                {
                  dispute.period === "2" ? (
                    <PeriodTime selected={true} date={timeoutDate < new Date() ? new Date() : timeoutDate} />
                  ) : (
                    <PeriodText>{formatEstimateTime(periodTimes[2])}</PeriodText>
                  )
                }
            </Col>
          </Row>
        </Col>
      </Row>
      <PurpleDivider />
      <Row>
        <Col lg={4}>Dispute</Col>
        <Col lg={19} offset={1}>Court</Col>
      </Row>
      <Row>
        <Col lg={4}>
          <a href={`https://court.kleros.io/cases/${disputeID}`}>
            <DisputeItemBox>
              { `# ${disputeID}` }
            </DisputeItemBox>
          </a>
        </Col>
        <Col lg={19} offset={1}>
          <DisputeItemBox>
            {
              subcourtInfo.name
            }
          </DisputeItemBox>
        </Col>
      </Row>
    </DisputeContainer>
  )
}
