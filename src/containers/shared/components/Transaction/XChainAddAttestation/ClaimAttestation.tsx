import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'

export interface ClaimAttestationProps {
  send: string
  account: string
  destination: string
  claimId: string
  signature: string
}

export const ClaimAttestation = (props: ClaimAttestationProps) => {
  const { t } = useTranslation()
  const { send, account, destination, claimId, signature } = props

  return (
    <div className="claim-attestation" key={signature}>
      <div className="claim-attestation-title">
        XChain Claim Attestation Batch Element
      </div>
      <SimpleRow label={t('send')}>
        <Amount value={send} />
      </SimpleRow>
      <SimpleRow label={t('account')}>
        <Account account={account} link={false} />
      </SimpleRow>
      <SimpleRow label={t('destination')}>
        <Account account={destination} />
      </SimpleRow>
      <SimpleRow label={t('xchain_claim_id')}>{claimId}</SimpleRow>
    </div>
  )
}
