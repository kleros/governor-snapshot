import { Col, Row, Select, Button, Upload, Tooltip, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import InfoBanner from "../components/info-banner";
import ListViewer from "../components/list-viewer";
import AppealModule from "../components/appeal-module";
import HowItWorks from "../components/how-it-works"
import governorInterfaceABI from "../constants/abis/governor";
import arbitratorInterfaceABI from "../constants/abis/court";
import { useFetchProjectByName } from "../hooks/projects";
import { useFetchAccount } from "../hooks/account";
import { useFetchSession, useFetchListSubmissionCost, useFetchSubmittedLists } from "../hooks/governor";
import { useLocalStorage } from '../hooks/local';
import { capitalizeString } from "../util/text";
import { switchCurrentChain, useFetchChainId } from "../hooks/chain";
import web3 from "../ethereum/web3";
import { ProjectParams, SubmissionList } from "../types";
import { AbiItem } from "web3-utils";

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
const StyledInvalidNetwork = styled.div`
  font-size: 16px;
  padding-top: 5px;
  line-height: 33px;
  align-items: center;
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
  width: 100px;
`;
const CSVUpload = styled.div`
  color: #009aff;
  font-size: 12px;
  font-style: italic;
  cursor: pointer;
  margin-top: 7px;
`

const ProjectHome: React.FC<{ match: ProjectParams }> = (props) => {
  const {
    match: { params },
  } = props;
  const [cachedPendingLists, setPendingListsCache] = useLocalStorage('CACHED_LISTS', undefined)
  const [listsShown, setListsShown] = useState<string>("current");
  const [pendingLists, setPendingLists] = useState(cachedPendingLists);
  const [isLoadingChainData, setIsLoadingChainData] = useState(false);

  const onListShownChange = (value: unknown) => {
    const newListShown: string = value ? value.toString() : "current";
    setListsShown(newListShown);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
    }
  });

  const addToPendingLists = (newList: SubmissionList[]) => {
    const pendingListsCopy = [...pendingLists];
    pendingListsCopy.push(newList);
    setPendingListsCache(pendingListsCopy)
    setPendingLists(pendingListsCopy);
  };

  const clearTx = (index: number) => {
    const _pendingLists = [...pendingLists]
    if (index > -1) {
      _pendingLists.splice(index, 1)
      setPendingListsCache(_pendingLists)
      setPendingLists(_pendingLists)
    }
  };

  const clearAllPendingLists = () => {
    setPendingListsCache(undefined)
    setPendingLists(undefined)
  }

  const _uploadTxs = (rows: string[][]) => {
    const _rows = []
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][3] && rows[i][3].substring(0, 2) !== '0x')
        rows[i][3] = '0x' + rows[i][3]

      if (rows[i][0]) {
        _rows.push({
          title: rows[i][0],
          address: rows[i][1],
          value: rows[i][2],
          data: rows[i][3]
        })
      }
    }

    setPendingListsCache(_rows)
    setPendingLists(_rows)
  }

  // Web3 Objects
  const projectInfo = useFetchProjectByName(params.projectName);
  const chainId = useFetchChainId();
  let correctChain = chainId == projectInfo.chain.id;

  const governorContractInstance = new web3.eth.Contract(
    governorInterfaceABI,
    projectInfo.governorAddress
  );

  const arbitratorContractInstance = new web3.eth.Contract(
    arbitratorInterfaceABI,
    projectInfo.arbitratorAddress
  );

  const account: string = useFetchAccount();

  const session = useFetchSession(governorContractInstance);

  const costPerTx = useFetchListSubmissionCost(
    governorContractInstance,
    arbitratorContractInstance
  );

  const submittedLists = useFetchSubmittedLists(
    governorContractInstance,
    session.currentSessionNumber || 0
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
                {capitalizeString(`${params.projectName} @ ${projectInfo.chain.name}`)}
              </span>
            }
          </StyledHeader>
        </Col>
        <Col lg={4} md={6} sm={6} xs={8}>
          {
            chainId === undefined || isLoadingChainData ?
              <Spin />
              :
              (correctChain ?
                <HowItWorks />
                :
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setIsLoadingChainData(true);
                    switchCurrentChain(projectInfo.chain);
                  }}>
                  Switch Network
                </Button>
              )
          }
        </Col>
      </Row>
      {
        correctChain ?
          (
            <div>
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
                    onChange={onListShownChange}
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
                    style={{ float: 'right' }}
                    onClick={() => setPendingLists([])}
                  >New List</Button>
                  {
                    pendingLists && pendingLists.length === 0 && (
                      <div>
                        <Upload
                          accept=".csv"
                          showUploadList={false}
                          beforeUpload={file => {
                            const reader = new FileReader()

                            reader.onload = e => {
                              if (!e?.target?.result || typeof e.target.result !== "string") {
                                throw new Error("Cannot read .csv");
                              }
                              const _csvRows = e.target.result.split(/\r?\n/)
                              const _csvCols: string[][] = []
                              _csvRows.forEach(row => {
                                _csvCols.push(row.split(','))
                              })
                              _uploadTxs(_csvCols)
                            }
                            reader.readAsText(file)

                            // Prevent upload
                            return false;
                          }}>
                          <Tooltip title="Row Format: title, contract address, WEI value, data">
                            <CSVUpload>Upload CSV</CSVUpload>
                          </Tooltip>
                        </Upload>
                      </div>
                    )
                  }
                </Col>
              </ListOptionsRow>
              {pendingLists ? (
                <ReturnButton onClick={() => clearAllPendingLists()}>
                  <ArrowLeftOutlined /> Return
                </ReturnButton>
              ) : (
                ""
              )}
              <ListViewer
                governorContractInstance={governorContractInstance}
                chain={projectInfo.chain}
                account={account}
                pendingLists={pendingLists}
                addToPendingLists={addToPendingLists}
                costPerTx={costPerTx}
                onClear={clearTx}
                submittedLists={submittedLists}
              />
              {session.disputeID ? (
                <AppealModule
                  session={session}
                  governorContractInstance={governorContractInstance}
                  chain={projectInfo.chain}
                  arbitratorContractInstance={arbitratorContractInstance}
                  account={account}
                />
              ) : (
                ""
              )}
            </div>) :
          <div>
            <StyledInvalidNetwork>
              Invalid network.
            </StyledInvalidNetwork>
          </div>
      }
    </StyledProjectHome>
  );
}

export default ProjectHome;
