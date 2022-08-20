import React from 'react'
// import { useTranslation } from 'react-i18next'
// import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { XChainBridge } from '../XChainBridge'
import { ClaimAttestation } from './ClaimAttestation'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  // const { t } = useTranslation()
  const {
    data: {
      instructions: {
        lockingDoor,
        lockingIssue,
        issuingDoor,
        issuingIssue,
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
    </>
  )
}
