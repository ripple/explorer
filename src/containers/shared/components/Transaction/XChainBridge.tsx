import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../Account'
import { Amount } from '../Amount'
import { SimpleRow } from './SimpleRow'

interface XChainBridgeProps {
  lockingDoor: string
  lockingIssue: string
  issuingDoor: string
  issuingIssue: string
  signatureReward: string | undefined
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
      <SimpleRow label={t('locking_chain_door')}>
        <Account account={lockingDoor} link={lockingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow label={t('locking_chain_issue')}>{lockingIssue}</SimpleRow>
      <SimpleRow label={t('issuing_chain_door')}>
        <Account account={issuingDoor} link={issuingDoor === bridgeOwner} />
      </SimpleRow>
      <SimpleRow label={t('issuing_chain_issue')}>{issuingIssue}</SimpleRow>
      {signatureReward && (
        <SimpleRow label={t('signature_reward')}>
          <Amount value={signatureReward} />
        </SimpleRow>
      )}
    </>
  )
}
