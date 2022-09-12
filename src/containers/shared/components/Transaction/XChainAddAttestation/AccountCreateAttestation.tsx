import React from 'react'
import { useTranslation } from 'react-i18next'
import Account from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'

export interface AccountCreateAttestationProps {
  send: string
  account: string
  destination: string
  signature: string
}

export const AccountCreateAttestation = (
  props: AccountCreateAttestationProps,
) => {
  const { t } = useTranslation()
  const { send, account, destination, signature } = props

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
    </div>
  )
}
