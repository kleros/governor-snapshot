import { Row, Col } from 'antd'
import React, { Fragment } from "react";
import styled from "styled-components";
import TopBanner from './appeal/top-banner'
import Note from './appeal/note'
import AppealSideBox from './appeal/appeal-side-box'
import getAppealCost from '../util/get-appeal-cost'
import {
  useFetchRoundInfo,
  useFetchArbitratorExtraData,
  useFetchCrowdfundingVariables,
  useFetchSubmittedLists
} from "../hooks/governor";
import {
  useFetchDispute,
  useFetchCurrentRuling,
  useFetchAppealFee,
  useFetchAppealTimes,
} from "../hooks/arbitrator";

const AppealModule = styled.div`
  margin-top: 25px;
`;
const AppealHeading = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
  color: rgba(0, 0, 0, 0.85);
  margin-top: 35px;
`
const AppealSubtext = styled.div`
  margin-top: 25px;
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`

export default ({
  governorContractInstance,
  arbitratorContractInstance,
  session,
  web3,
  account
}) => {
  // Get appeal information from Governor
  const sessionRoundInformation = useFetchRoundInfo(
    governorContractInstance,
    session.sessionNumber || "0"
  );
  const arbitratorExtraData = useFetchArbitratorExtraData(
    governorContractInstance
  );
  const crowdfundingVariables = useFetchCrowdfundingVariables(
    governorContractInstance
  );
  const submittedLists = useFetchSubmittedLists(
    governorContractInstance,
    web3
  );

  // Get appeal information from Arbitrator
  const dispute = useFetchDispute(
    arbitratorContractInstance,
    session.disputeID || "0"
  );
  const currentRuling = useFetchCurrentRuling(
    arbitratorContractInstance,
    session.disputeID || "0"
  );
  const appealFee = useFetchAppealFee(
    arbitratorContractInstance,
    session.disputeID || "0",
    arbitratorExtraData || "0x0"
  );
  const appealTimes = useFetchAppealTimes(
    arbitratorContractInstance,
    session.disputeID || 0
  );

  const winningList = (submittedLists && currentRuling && submittedLists[currentRuling - 1]) || {}
  const winnerFee = getAppealCost(appealFee, crowdfundingVariables.winnerMultiplier, crowdfundingVariables.multiplierDivisor)
  const loserFee = getAppealCost(appealFee, crowdfundingVariables.loserMultiplier, crowdfundingVariables.multiplierDivisor)

  return (
    <AppealModule>
      {dispute && Number(dispute.period) === 3 ? (
        <TopBanner>
          <AppealHeading>
            Appeal the decision
          </AppealHeading>
          <AppealSubtext>
            In order to appeal the decision, you need to fully fund the crowdfunding deposit. The dispute will be sent to the jurors when the full deposit is reached. Note that if the previous round loser funds its side, the previous round winner should also fully fund its side in order not to lose the case.
          </AppealSubtext>
          <Note />
          <Row>
            {
              submittedLists.map((l, i) => {
                return (
                  <Col lg={12} key={i}>
                    <AppealSideBox
                      winner={i === currentRuling - 1}
                      listID={l.listID}
                      submitter={l.submitter}
                      deadline={(i === currentRuling - 1) ?
                        new Date(Number(appealTimes.end) * 1000) :
                        new Date((Number(appealTimes.end) - (Number(appealTimes.end) - Number(appealTimes.start))) * 1000)
                      }
                      appealFee={(i === currentRuling - 1) ? winnerFee : loserFee}
                      amountContributed={sessionRoundInformation.paidFees && sessionRoundInformation.paidFees[i]}
                      rewardPercentage={i === currentRuling - 1 ? "100" : "50"}
                      governorContractInstance={governorContractInstance}
                      submissionIndex={i}
                      account={account}
                    />
                </Col>
                )
              })
            }
          </Row>
        </TopBanner>
      ) : ""}
    </AppealModule>
  );
};
