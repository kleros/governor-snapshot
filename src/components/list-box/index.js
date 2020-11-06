import React, { useState } from 'react'
import styled from 'styled-components'
import ListBoxTopMenu from './top-menu'
import ListBoxLists from './lists'

export default ({ txs, account, submittable, costPerTx, governorContractInstance, showByDefault }) => {
  const [ showLists, setShowLists ] = useState(showByDefault)

  const showHideLists = () => {
    setShowLists(!showLists)
  }

  return (
    <div>
      <ListBoxTopMenu listNumber={1} numberOfTxs={txs.length} submittedAt={null} submitter={account} setShowHide={showHideLists} />
      {
        showLists ? (
          <ListBoxLists txs={txs} submittable={submittable} submitter={account} governorContractInstance={governorContractInstance} costPerTx={costPerTx} />
        ) : (
          ''
        )
      }
    </div>
  )
}
