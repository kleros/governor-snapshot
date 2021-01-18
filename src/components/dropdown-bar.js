import { Row, Col } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import React, { useState, Fragment } from 'react'
import styled from 'styled-components'

const DropdownBar = styled.div`
  background: #4D00B4;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;
  padding: 10px 0px;
  margin-top: 48px;
`
const Icon = styled.div`
  float: right;
`

export default ({ ...props }) => {
  const [ showChildren, setShowChildren ] = useState(true)
  return (
    <Fragment>
      <DropdownBar onClick={() => setShowChildren(!showChildren)}>
        <Row>
          <Col lg={4} offset={1}>
            Evidence
          </Col>
          <Col lg={18}>
            <Icon>
              {
                showChildren ? (
                  <MinusOutlined />
                ) : (
                  <PlusOutlined />
                )
              }
            </Icon>
          </Col>
        </Row>
      </DropdownBar>
      {
        showChildren ? props.children : ''
      }
    </Fragment>
  )
}
