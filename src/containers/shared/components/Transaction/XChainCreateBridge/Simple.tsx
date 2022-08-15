import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

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
        signatureReward,
        minAccountCreateAmount,
        bridgeOwner,
      },
    },
  } = props

  return (
    <>
      <SimpleRow label={t('locking_chain_door')}>
        <Account account={lockingDoor} link={lockingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow label={t('locking_chain_issue')}>{lockingIssue}</SimpleRow>
      <SimpleRow label={t('issuing_chain_door')}>
        <Account account={issuingDoor} link={issuingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow label={t('issuing_chain_issue')}>{issuingIssue}</SimpleRow>
      <SimpleRow label={t('signature_reward')}>
        <Amount value={signatureReward} />
      </SimpleRow>
      {minAccountCreateAmount && (
        <SimpleRow label={t('min_account_create_amount')}>
          <Amount value={minAccountCreateAmount} />
        </SimpleRow>
      )}
    </>
  )
}
