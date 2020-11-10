import { Row, Col } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import React from 'react'
import styled from 'styled-components'
import TimeAgo from './time-ago'

const WithdrawBanner = styled.div`
  border: 1px solid #FF9900;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 25px 24px;
`
const Heading = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FF9900;
`
const Subtext = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`
const StyledInfoCol = styled(Col)`
  color: #FF9900;
  font-size: 24px;
  line-height: 34px;
`

export default ({timeout}) => {
  console.log(timeout)
  return (
    <WithdrawBanner>
      <Row>
        <StyledInfoCol lg={2}>
          <InfoCircleOutlined />
        </StyledInfoCol>
        <Col lg={22}>
          <Heading>The list has been submitted. Withdrawl timeout: <TimeAgo date={timeout || new Date()} /></Heading>
          <Subtext>If you notice someone has posted a similar list or you spot a mistake, withdraw your list in order to avoid a dispute.</Subtext>
        </Col>
      </Row>
    </WithdrawBanner>
  )
}
