import { Row, Col } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useFetchSessionStart, useFetchSessionEnd } from '../hooks/governor'
import { monthIndexToAbbrev } from '../util/text'
import TimeAgo from './time-ago'

const InfoBanner = styled.div`
  background: #FBF9FE;
  border-top: 2px solid #4D00B4;
  border-radius: 3px;
  color: #4D00B4;
  font-size: 14px;
  line-height: 22px;
  padding: 23px 32px;
  margin-top: 24px;
`
const SessionEndText = styled.div`
  text-align: center
`
const StyledTimeAgo = styled(TimeAgo)`
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
`

export default ({ governorContractInstance }) => {
  const sessionStart = useFetchSessionStart(governorContractInstance)
  const sessionEnd = useFetchSessionEnd(governorContractInstance)
  console.log(sessionEnd)

  return (
    <InfoBanner>
      <Row>
        <Col lg={18}>
          <span>Governor decision from <a href={`https://snapshot.page/#/`}>Snapshot.</a></span>
          <br/>
          <span><b>Session:</b> Votes approved before {sessionStart && `${monthIndexToAbbrev(sessionStart.getUTCMonth())} ${sessionStart.getUTCDate()}, ${sessionStart.getUTCFullYear()} - ${sessionStart.getUTCHours()}h ${sessionStart.getUTCMinutes()}m`}</span>
        </Col>
        <Col lg={6}>
          <SessionEndText>
            List submission in <br />
            <StyledTimeAgo date={sessionEnd || new Date()} />
          </SessionEndText>
        </Col>
      </Row>
    </InfoBanner>
  )
}
