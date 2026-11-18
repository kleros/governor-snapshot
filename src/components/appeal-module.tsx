import { Row, Col } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import TopBanner from "./appeal/top-banner";
import Note from "./appeal/note";
import AppealSideBox from "./appeal/appeal-side-box";
import { getAppealCost } from "../util/get-appeal-cost";
import {
  useFetchCrowdfundingVariables,
  useFetchArbitratorExtraData,
  useFetchRoundInfo,
  useFetchSubmittedLists,
} from "../hooks/governor";
import {
  useFetchAppealFee,
  useFetchAppealTimes,
  useFetchDispute,
  useFetchCurrentRuling,
} from "../hooks/arbitrator";
import { Contract } from "web3-eth-contract";
import {
  AppealPeriod,
  Chain,
  Dispute,
  Session,
} from "../types";

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
  governorContractInstance: Contract;
  chain: Chain;
  arbitratorContractInstance: Contract;
  session: Session;
  account: string;
}> = (p) => {
  //Bumped after a successful funding, so the round and the dispute are re-read without a page reload
  const [refreshKey, setRefreshKey] = useState(0);

  // Get appeal information from Governor
  const sessionRoundInformation = useFetchRoundInfo(
    p.governorContractInstance,
    p.session.currentSessionNumber || 0,
    refreshKey
  );
  const arbitratorExtraData = useFetchArbitratorExtraData(
    p.governorContractInstance
  );
  const crowdfundingVariables = useFetchCrowdfundingVariables(
    p.governorContractInstance
  );
  const { submittedLists } = useFetchSubmittedLists(
    p.governorContractInstance,
    p.session.currentSessionNumber,
    p.chain
  );
  // Get appeal information from Arbitrator
  const dispute: Dispute | undefined = useFetchDispute(
    p.arbitratorContractInstance,
    p.session.disputeID || 0,
    refreshKey
  );
  const currentRuling: number | undefined = useFetchCurrentRuling(
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
  const sharedFee = getAppealCost(
    appealFee,
    crowdfundingVariables.sharedMultiplier,
    crowdfundingVariables.multiplierDivisor
  );

  //Ruling 0 means the jurors refused to arbitrate or tied, so no list won the previous round.
  //In that case the contract charges every list the shared fee and lets every list fund until the end of the appeal period.
  const ruling = currentRuling;
  const appealEnd = new Date(Number(appealTimes?.end) * 1000);
  //The previous round loser can only fund during the first half of the appeal period
  const loserDeadline = new Date(
    (Number(appealTimes?.end) -
      (Number(appealTimes?.end) - Number(appealTimes?.start)) / 2) *
      1000
  );

  return (
    <StyledAppealModule>
      {/* Wait for the ruling: it decides each list's fee and deadline */}
      {dispute && Number(dispute.period) === 3 && ruling !== undefined ? (
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
              //Rulings are 1-indexed (0 is no winner), lists are 0-indexed
              const isWinner = ruling !== 0 && i === ruling - 1;
              const isLoser = ruling !== 0 && !isWinner;
              return (
                <Col lg={12} key={i}>
                  <AppealSideBox
                    previousRoundLabel={
                      isWinner
                        ? "Previous round winner"
                        : isLoser
                        ? "Previous round loser"
                        : "No winner in previous round"
                    }
                    listID={l.listID}
                    submitter={l.submitter}
                    deadline={isLoser ? loserDeadline : appealEnd}
                    appealFee={
                      isWinner ? winnerFee : isLoser ? loserFee : sharedFee
                    }
                    amountContributed={
                      sessionRoundInformation.paidFees &&
                      sessionRoundInformation.paidFees[i]
                    }
                    hasPaid={
                      !!sessionRoundInformation.hasPaid &&
                      sessionRoundInformation.hasPaid[i] === true
                    }
                    rewardPercentage={isWinner ? "100" : "50"}
                    governorContractInstance={p.governorContractInstance}
                    chain={p.chain}
                    submissionIndex={i}
                    account={p.account}
                    onFunded={() => setRefreshKey((k) => k + 1)}
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
};

export default AppealModule;
