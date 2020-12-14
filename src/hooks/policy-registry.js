import React, { useState, useEffect } from 'react'

export const useFetchSubcourt = (policyRegistryInstance, subcourtID) => {
  const [ subcourtUri, setSubcourtUri ] = useState({})
  const [ subcourt, setSubcourt ] = useState({})

  useEffect(()=> {
    policyRegistryInstance.methods.policies(subcourtID).call().then(r => setSubcourtUri(r))
  }, [policyRegistryInstance, subcourtID])

  useEffect(() => {
    const _fetchPolicy = async () => {
      const _policy = await fetch(subcourtUri).then(r => r.json())
      setSubcourt(_policy)
    }

    _fetchPolicy()
  }, [subcourtUri])

  return subcourt
}
