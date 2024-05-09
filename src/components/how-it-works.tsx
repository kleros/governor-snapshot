import { Modal } from 'antd'
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useState, Fragment } from 'react'
import styled from 'styled-components'

const LinkText = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #009aff;
  cursor: pointer;
`;

const HowItWorks: React.FC = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <LinkText style={{ float: "right", lineHeight: "36px" }} onClick={() => { setVisible(true) }}>
        How it works
        <InfoCircleOutlined style={{ marginLeft: "5px" }} />
      </LinkText>
      <Modal
        title="How it Works"
        open={visible}
        onCancel={() => { setVisible(false) }}
        footer={null}
      >
        Each governor session enforces governance decisions that were passed prior to the start of the current session.
        <br /><br />
        A user submits a list of transactions to be executed by the governor contract at the end of the session. If there is only one list submitted for the session, it will be accepted and the deposit is returned to the submitter.
        <br /><br />
        If a competing list is submitted in the same session, a dispute will be created in Kleros Court to choose which list is correct. After dispute resolution concludes the deposit from the losing list will be used to pay the jurors and reward the user that submitted the winning list.
        <br /><br />
        Lists that most completely enforce the greatest number of governance decisions will be accepted. The process for choosing between lists can be seen <a href="https://cdn.kleros.link/ipfs/QmPt2oTHCYZYUShuLxiK4QWH6sXPHjvgXTqMDpCShKogQY/KlerosGovernorPrimaryDocument.pdf">here</a>.
      </Modal>
    </Fragment>
  )
}

export default HowItWorks;
