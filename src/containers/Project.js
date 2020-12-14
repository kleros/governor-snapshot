import { Col, Row, Select, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import InfoBanner from "../components/info-banner";
import NewListModal from "../components/new-list-modal";
import ListViewer from "../components/list-viewer";
import AppealModule from "../components/appeal-module";
import HowItWorks from "../components/how-it-works"
import GovernorInterface from "../constants/abis/governor.json";
import ArbitratorInterface from "../constants/abis/court.json";
import { useFetchProjectByName } from "../hooks/projects";
import { useFetchAccount } from "../hooks/account";
import { useFetchSession, useFetchListSubmissionCost } from "../hooks/governor";
import { capitalizeString } from "../util/text";
import DisputeBanner from "../components/dispute-banner";
import DisputeContainer from "../components/dispute-container";

import {
  useFetchSubmittedLists,
} from "../hooks/governor";

const Dot = styled.div`
  height: 8px;
  width: 8px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
`;

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
  color: #009aff;
  cursor: pointer;
`;
const ListOptionsRow = styled(Row)`
  margin: 35px 0px;
`;
const StyledSelect = styled(Select)`
  background: #ffffff;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  border-radius: 3px;
  font-size: 16px;
  line-height: 22px;
  min-width: 220px;
`;
const ReturnButton = styled.div`
  color: #009aff;
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  margin: 20px 0px;
`;

export default (props) => {
  const {
    match: { params },
  } = props;
  const [listsShown, setListsShown] = useState("current");
  const [pendingLists, setPendingLists] = useState();
  // Cache ABIs
  const [abiCache, setAbiCache] = useState({});
  // Tx State
  const [pendingTx, setPendingTx] = useState(false)

  const addToPendingLists = (newList) => {
    const pendingListsCopy = [...pendingLists];
    pendingListsCopy.push(newList);
    setPendingLists(pendingListsCopy);
  };

  // Web3 Objects
  const projectInfo = useFetchProjectByName(params.projectName);
  const governorContractInstance = new props.web3.eth.Contract(
    GovernorInterface.abi,
    projectInfo.governorAddress
  );
  const arbitratorContractInstance = new props.web3.eth.Contract(
    ArbitratorInterface.abi,
    projectInfo.arbitratorAddress
  );
  const account = useFetchAccount(props.web3);

  const session = useFetchSession(governorContractInstance);

  const costPerTx = useFetchListSubmissionCost(
    governorContractInstance,
    arbitratorContractInstance
  );

  const clearTx = (index) => {
    const _pendingLists = [ ...pendingLists ]
    if (index > -1) {
      _pendingLists.splice(index, 1)
      setPendingLists(_pendingLists)
    }
  }

  const submittedLists = useFetchSubmittedLists(
    governorContractInstance,
    props.web3,
    session.currentSessionNumber || "0"
  );

  return (
    <StyledProjectHome>
      <Row>
        <Col lg={20} md={18} sm={18} xs={16}>
          <StyledHeader>
            <Link to="/">Governor</Link>
            {
              <span style={{ fontWeight: "300" }}>
                {" "}
                / {projectInfo.icon}
                {capitalizeString(params.projectName)}
              </span>
            }
          </StyledHeader>
        </Col>
        <Col lg={4} md={6} sm={6} xs={8}>
          <HowItWorks />
        </Col>
      </Row>
      <InfoBanner
        governorContractInstance={governorContractInstance}
        account={account}
        session={session}
        snapshotSlug={projectInfo.snapshotSlug}
        showTimeout={!!submittedLists.length}
      />
      <ListOptionsRow>
        <Col lg={20} md={12} sm={12} xs={12}>
          <StyledSelect
            onChange={setListsShown}
            defaultValue="current"
            disabled={true}
          >
            <Select.Option value="current">
              <span>
                <Dot
                  style={{
                    backgroundColor: "#009AFF",
                    marginRight: "8px",
                    marginBottom: "1px",
                  }}
                />
                Current Lists
              </span>
            </Select.Option>
            <Select.Option value="executed">
              <span>
                <Dot
                  style={{
                    backgroundColor: "#00C42B",
                    marginRight: "8px",
                    marginBottom: "1px",
                  }}
                />
                Executed Lists
              </span>
            </Select.Option>
          </StyledSelect>
        </Col>
        <Col lg={4} md={12} sm={12} xs={12}>
          <Button
            type="primary"
            disabled={pendingLists}
            style={{float: 'right'}}
            onClick={() => setPendingLists([])}
          >New List</Button>
        </Col>
      </ListOptionsRow>
      {pendingLists ? (
        <ReturnButton onClick={() => setPendingLists(undefined)}>
          <ArrowLeftOutlined /> Return
        </ReturnButton>
      ) : (
        ""
      )}
      <ListViewer
        governorContractInstance={governorContractInstance}
        arbitratorContractInstance={arbitratorContractInstance}
        account={account}
        pendingLists={pendingLists}
        addToPendingLists={addToPendingLists}
        web3={props.web3}
        abiCache={abiCache}
        setAbiCache={setAbiCache}
        session={session}
        costPerTx={costPerTx}
        onClear={clearTx}
        submittedLists={submittedLists}
        setPendingTx={setPendingTx}
      />
      {session.disputeID ? (
        <Fragment>
          <DisputeBanner />
          <DisputeContainer
            arbitratorContractInstance={arbitratorContractInstance}
            disputeID={session.disputeID}
            web3={props.web3}
            projectInfo={projectInfo}
          />
          <AppealModule
            session={session}
            governorContractInstance={governorContractInstance}
            arbitratorContractInstance={arbitratorContractInstance}
            web3={props.web3}
            account={account}
          />
        </Fragment>
      ) : (
        ""
      )}
    </StyledProjectHome>
  );
};
