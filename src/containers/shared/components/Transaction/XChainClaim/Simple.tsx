import React from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { XChainBridge } from '../XChainBridge'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    lockingDoor,
    lockingIssue,
    issuingDoor,
    issuingIssue,
    bridgeOwner,
    claimId,
    destination,
    amount,
  } = data.instructions

  return (
    <>
      <XChainBridge
        lockingDoor={lockingDoor}
        lockingIssue={lockingIssue}
        issuingDoor={issuingDoor}
        issuingIssue={issuingIssue}
        bridgeOwner={bridgeOwner}
      />
      <SimpleRow label={t('xchain_claim_id')} data-test="claim-id">
        {claimId}
      </SimpleRow>
      <SimpleRow label={t('destination')} data-test="destination">
        <Account account={destination} />
      </SimpleRow>
      <SimpleRow label={t('amount')} data-test="amount">
        <Amount value={amount} />
      </SimpleRow>
    </>
  )
}
