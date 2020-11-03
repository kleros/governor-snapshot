import { useState, useEffect } from "react";

/**
 Fetch the time of the start of the session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the start of the session
 */
export const useFetchSessionStart = (governorContractInstance) => {
  const [ sessionStart, setSessionStart ] = useState()

  useEffect(() => {
    const _getLastApprovalTime = async () => {
      const _lastApprovalTime = await governorContractInstance.methods.lastApprovalTime().call()
      setSessionStart(new Date(Number(_lastApprovalTime) * 1000))
    }
    _getLastApprovalTime()
  }, [])

  return sessionStart
}

/**
 Fetch the end of the current session.
 param: governorContractInstance - web3 Contract object
 return: Date object at the end of the session
 */
export const useFetchSessionEnd = (governorContractInstance) => {
  const [ sessionStart, setSessionStart ] = useState(0)
  const [ submissionTimeout, setSubmissionTimeout ] = useState(0)
  const [ sessionNumber, setSessionNumber ] = useState(0)
  const [ durationOffset, setDurationOffset ] = useState(0)

  // Initial calls
  useEffect(() => {
    governorContractInstance.methods.lastApprovalTime().call().then(r => {
      setSessionStart(Number(r))
    })
    // Fetch submission timeout
    governorContractInstance.methods.submissionTimeout().call().then(r => {
      setSubmissionTimeout(Number(r))
    })
    // Fetch session
    governorContractInstance.methods.getCurrentSessionNumber().call().then(r => {
      setSessionNumber(Number(r))
    })
  }, [])

  // Fetch durationOffset after we have the session number
  useEffect(() => {
    governorContractInstance.methods.sessions(sessionNumber).call().then(r => {
      setDurationOffset(Number(r.durationOffset))
    })
  }, [sessionNumber])

  return new Date(
    (Number(sessionStart) + Number(submissionTimeout) + Number(durationOffset)) * 1000
  )
}
