import { useState, useEffect } from "react";

export const useFetchDispute = (arbitratorContractInstance, disputeID) => {
  const [dispute, setDispute] = useState({});

  useEffect(() => {
    arbitratorContractInstance.methods
      .disputes(disputeID)
      .call()
      .then((r) => setDispute(r));
  }, [arbitratorContractInstance, disputeID]);

  return dispute;
};

export const useFetchCurrentRuling = (
  arbitratorContractInstance,
  disputeID
) => {
  const [currentRuling, setCurrentRuling] = useState({});

  useEffect(() => {
    arbitratorContractInstance.methods
      .currentRuling(disputeID)
      .call()
      .then((r) => setCurrentRuling(r));
  }, [arbitratorContractInstance, disputeID]);

  return currentRuling;
};

export const useFetchAppealFee = (
  arbitratorContractInstance,
  disputeID,
  extraData
) => {
  const [appealFee, setAppealFee] = useState("0");

  useEffect(() => {
    arbitratorContractInstance.methods
      .appealCost(disputeID, extraData)
      .call()
      .then((r) => setAppealFee(r));
  }, [arbitratorContractInstance, disputeID, extraData]);

  return appealFee;
};

export const useFetchAppealTimes = (arbitratorContractInstance, disputeID) => {
  const [appealTimes, setAppealTimes] = useState([]);

  useEffect(() => {
    arbitratorContractInstance.methods
      .appealPeriod(disputeID)
      .call()
      .then((r) => setAppealTimes(r));
  }, [appealTimes]);

  return appealTimes;
};
