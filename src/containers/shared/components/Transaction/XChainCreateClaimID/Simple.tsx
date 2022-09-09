import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
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
        signatureReward,
        otherChainAccount,
        bridgeOwner,
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
        signatureReward={signatureReward}
        bridgeOwner={bridgeOwner}
      />
      <SimpleRow
        label={t('other_chain_account')}
        data-test="other-chain-account"
      >
        <Account account={otherChainAccount} link={false} />
      </SimpleRow>
    </>
  )
}
