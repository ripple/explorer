import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { XChainBridge } from '../XChainBridge'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  const { t } = useTranslation()
  const {
    data: {
      instructions: {
        lockingDoor,
        lockingIssue,
        issuingDoor,
        issuingIssue,
        amount,
        xchainClaimId,
        bridgeOwner,
      },
    },
  } = props

  return (
    <>
      <SimpleRow label={t('send')}>
        <Amount value={amount} />
      </SimpleRow>
      <XChainBridge
        lockingDoor={lockingDoor}
        lockingIssue={lockingIssue}
        issuingDoor={issuingDoor}
        issuingIssue={issuingIssue}
        bridgeOwner={bridgeOwner}
      />
      <SimpleRow label={t('xchain_claim_id')}>{xchainClaimId}</SimpleRow>
    </>
  )
}
