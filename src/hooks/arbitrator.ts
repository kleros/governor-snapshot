import { Contract } from "web3-eth-contract"
import { useState, useEffect } from "react";
import { AppealPeriod, Dispute } from "../types";

/**
 Returns undefined until the ruling of this dispute is loaded, because 0 is a real ruling (refused to arbitrate or tied).
 The ruling is stored with its dispute ID, so another dispute's ruling is never returned.
 */
export const useFetchCurrentRuling = (
  arbitratorContractInstance: Contract,
  disputeID: number
) => {
  const [currentRuling, setCurrentRuling] = useState<
    { disputeID: string; ruling: number } | undefined
  >(undefined);

  useEffect(() => {
    let isLatestRequest = true;
    arbitratorContractInstance.methods
      .currentRuling(disputeID)
      .call()
      .then((r: number) => {
        if (isLatestRequest) setCurrentRuling({ disputeID: String(disputeID), ruling: Number(r) });
      });
    return () => {
      isLatestRequest = false;
    };
  }, [arbitratorContractInstance, disputeID]);

  return currentRuling && currentRuling.disputeID === String(disputeID)
    ? currentRuling.ruling
    : undefined;
};

//refreshKey: change it to force a re-read, e.g. after funding raised an appeal and the dispute left the appeal period
export const useFetchDispute = (arbitratorContractInstance: Contract, disputeID: number, refreshKey: number = 0) => {
  const [dispute, setDispute] = useState<Dispute | undefined>(undefined);

  useEffect(() => {
    //Ignore answers to an older request, e.g. a refresh that finished after a newer one
    let isLatestRequest = true;
    arbitratorContractInstance.methods
      .disputes(disputeID)
      .call()
      .then((r: Dispute) => {
        if (isLatestRequest) setDispute(r);
      });
    return () => {
      isLatestRequest = false;
    };
  }, [arbitratorContractInstance, disputeID, refreshKey]);

  return dispute;
};

export const useFetchAppealTimes = (arbitratorContractInstance: Contract, disputeID: number) => {
  const [appealTimes, setAppealTimes] = useState<AppealPeriod | undefined>(undefined);

  useEffect(() => {
    arbitratorContractInstance.methods
      .appealPeriod(disputeID)
      .call()
      .then((r: AppealPeriod) => setAppealTimes(r));
  }, [appealTimes]);

  return appealTimes;
};

export const useFetchAppealFee = (
  arbitratorContractInstance: Contract,
  disputeID: number,
  extraData: string
) => {
  const [appealFee, setAppealFee] = useState<number>(0);

  useEffect(() => {
    arbitratorContractInstance.methods
      .appealCost(disputeID, extraData)
      .call()
      .then((r: number) => setAppealFee(r));
  }, [arbitratorContractInstance, disputeID, extraData]);

  return appealFee;
};
