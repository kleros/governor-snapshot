import { Row, Col } from "antd";
import React from "react";
import styled from "styled-components";
import TopBanner from "./appeal/top-banner";
import Note from "./appeal/note";
import AppealSideBox from "./appeal/appeal-side-box";
import { getAppealCost } from "../util/get-appeal-cost";
import {
  useFetchCrowdfundingVariables,
  useFetchArbitratorExtraData,
  useFetchRoundInfo,
  useFetchSubmittedLists
} from "../hooks/governor"
import {
  useFetchAppealFee,
  useFetchAppealTimes,
  useFetchDispute,
  useFetchCurrentRuling
} from "../hooks/arbitrator";
import { Contract } from "ethers";
import { AppealPeriod, Chain, Dispute, Session } from "../types";

const StyledAppealModule = styled.div`
  margin-top: 25px;
`;
const AppealHeading = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
  color: rgba(0, 0, 0, 0.85);
  margin-top: 35px;
`;
const AppealSubtext = styled.div`
  margin-top: 25px;
  font-size: 14px;
  line-height: 19px;
  color: rgba(0, 0, 0, 0.85);
`;

const AppealModule: React.FC<{
  governorContractInstance: Contract,
  chain: Chain,
  arbitratorContractInstance: Contract,
  session: Session,
  account: string,
}> = (p) => {
  // Get appeal information from Governor
  const sessionRoundInformation = useFetchRoundInfo(
    p.governorContractInstance,
    p.session.currentSessionNumber || 0
  );
  const arbitratorExtraData = useFetchArbitratorExtraData(
    p.governorContractInstance
  );
  const crowdfundingVariables = useFetchCrowdfundingVariables(
    p.governorContractInstance
  );
  const submittedLists: any[] = useFetchSubmittedLists(
    p.governorContractInstance,
    p.session.currentSessionNumber
  );

  // Get appeal information from Arbitrator
  const dispute: Dispute | undefined = useFetchDispute(
    p.arbitratorContractInstance,
    p.session.disputeID || 0
  );
  const currentRuling: number = useFetchCurrentRuling(
    p.arbitratorContractInstance,
    p.session.disputeID || 0
  );
  const appealFee = useFetchAppealFee(
    p.arbitratorContractInstance,
    p.session.disputeID || 0,
    arbitratorExtraData || "0x0"
  );
  const appealTimes: AppealPeriod | undefined = useFetchAppealTimes(
    p.arbitratorContractInstance,
    p.session.disputeID || 0
  );

  const winnerFee = getAppealCost(
    appealFee,
    crowdfundingVariables.winnerMultiplier,
    crowdfundingVariables.multiplierDivisor
  );
  const loserFee = getAppealCost(
    appealFee,
    crowdfundingVariables.loserMultiplier,
    crowdfundingVariables.multiplierDivisor
  );

  return (
    <StyledAppealModule>
      {dispute && Number(dispute.period) === 3 ? (
        <TopBanner>
          <AppealHeading>Appeal the decision</AppealHeading>
          <AppealSubtext>
            In order to appeal the decision, you need to fully fund the
            crowdfunding deposit. The dispute will be sent to the jurors when
            the full deposit is reached. Note that if the previous round loser
            funds its side, the previous round winner should also fully fund its
            side in order not to lose the case.
          </AppealSubtext>
          <Note />
          <Row>
            {submittedLists.map((l, i) => {
              return (
                <Col lg={12} key={i}>
                  <AppealSideBox
                    winner={i === currentRuling - 1}
                    listID={l.listID}
                    submitter={l.submitter}
                    deadline={
                      i === currentRuling - 1
                        ? new Date(Number(appealTimes?.end) * 1000)
                        : new Date(
                          (Number(appealTimes?.end) -
                            (Number(appealTimes?.end) -
                              Number(appealTimes?.start))) *
                          1000
                        )
                    }
                    appealFee={i === currentRuling - 1 ? winnerFee : loserFee}
                    amountContributed={
                      sessionRoundInformation.paidFees &&
                      sessionRoundInformation.paidFees[i]
                    }
                    rewardPercentage={i === currentRuling - 1 ? "100" : "50"}
                    governorContractInstance={p.governorContractInstance}
                    chain={p.chain}
                    submissionIndex={i}
                    account={p.account}
                  />
                </Col>
              );
            })}
          </Row>
        </TopBanner>
      ) : (
        ""
      )}
    </StyledAppealModule>
  );
}

export default AppealModule;
