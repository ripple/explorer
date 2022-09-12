import React from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { XChainBridge } from '../XChainBridge'
import Account from '../../Account'

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
        bridgeOwner,
        otherChainDestination,
      },
    },
  } = props

  return (
    <>
      <SimpleRow label={t('send')} data-test="send">
        <Amount value={amount} />
      </SimpleRow>
      <XChainBridge
        lockingDoor={lockingDoor}
        lockingIssue={lockingIssue}
        issuingDoor={issuingDoor}
        issuingIssue={issuingIssue}
        bridgeOwner={bridgeOwner}
      />
      <SimpleRow label={t('other_chain_destination')} data-test="destination">
        <Account account={otherChainDestination} link={false} />
      </SimpleRow>
    </>
  )
}
