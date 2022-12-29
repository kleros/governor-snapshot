import { Contract } from "ethers";
import { useState, useEffect } from "react";
import { AppealPeriod, Dispute } from "../types";

export const useFetchCurrentRuling = (
  arbitratorContractInstance: Contract,
  disputeID: number
) => {
  const [currentRuling, setCurrentRuling] = useState<number>(0);

  useEffect(() => {
    arbitratorContractInstance.methods
      .currentRuling(disputeID)
      .call()
      .then((r: number) => setCurrentRuling(r));
  }, [arbitratorContractInstance, disputeID]);

  return currentRuling;
};

export const useFetchDispute = (arbitratorContractInstance: Contract, disputeID: number) => {
  const [dispute, setDispute] = useState<Dispute | undefined>(undefined);

  useEffect(() => {
    arbitratorContractInstance.methods
      .disputes(disputeID)
      .call()
      .then((r: Dispute) => setDispute(r));
  }, [arbitratorContractInstance, disputeID]);

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
