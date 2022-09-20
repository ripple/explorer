import React from 'react'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { XChainBridge } from '../XChainBridge'
import { AccountCreateAttestation } from './AccountCreateAttestation'
import { ClaimAttestation } from './ClaimAttestation'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  const {
    data: {
      instructions: {
        lockingDoor,
        lockingIssue,
        issuingDoor,
        issuingIssue,
        accountCreateAttestations,
        claimAttestations,
      },
    },
  } = props

  return (
    <>
      <XChainBridge
        lockingDoor={lockingDoor}
        lockingIssue={lockingIssue}
        issuingDoor={issuingDoor}
        issuingIssue={issuingIssue}
        bridgeOwner=""
      />
      {claimAttestations.map(ClaimAttestation)}
      {accountCreateAttestations.map(AccountCreateAttestation)}
    </>
  )
}
