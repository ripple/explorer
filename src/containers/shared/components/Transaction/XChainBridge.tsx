import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../Account'
import { Amount } from '../Amount'
import { SimpleRow } from './SimpleRow'

export interface XChainBridgeProps {
  lockingDoor: string
  lockingIssue: string
  issuingDoor: string
  issuingIssue: string
  signatureReward?: string
  bridgeOwner: string
}

export const XChainBridge = (props: XChainBridgeProps) => {
  const { t } = useTranslation()
  const {
    lockingDoor,
    lockingIssue,
    issuingDoor,
    issuingIssue,
    signatureReward,
    bridgeOwner,
  } = props

  return (
    <>
      <SimpleRow label={t('locking_chain_door')} data-test="locking-chain-door">
        <Account account={lockingDoor} link={lockingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('locking_chain_issue')}
        data-test="locking-chain-issue"
      >
        {lockingIssue}
      </SimpleRow>
      <SimpleRow label={t('issuing_chain_door')} data-test="issuing-chain-door">
        <Account account={issuingDoor} link={issuingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow
        label={t('issuing_chain_issue')}
        data-test="issuing-chain-issue"
      >
        {issuingIssue}
      </SimpleRow>
      {signatureReward && (
        <SimpleRow label={t('signature_reward')} data-test="signature-reward">
          <Amount value={signatureReward} />
        </SimpleRow>
      )}
    </>
  )
}
