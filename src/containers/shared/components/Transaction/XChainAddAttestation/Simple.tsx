import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
// import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps,
) => {
  const { t } = useTranslation()
  const {
    data: {
      instructions: { lockingDoor, lockingIssue, issuingDoor, issuingIssue },
    },
  } = props

  return (
    <>
      <SimpleRow label={t('locking_chain_door')}>
        <Account account={lockingDoor} />
      </SimpleRow>
      <SimpleRow label={t('locking_chain_issue')}>{lockingIssue}</SimpleRow>
      <SimpleRow label={t('issuing_chain_door')}>
        <Account account={issuingDoor} />
      </SimpleRow>
      <SimpleRow label={t('issuing_chain_issue')}>{issuingIssue}</SimpleRow>
    </>
  )
}
