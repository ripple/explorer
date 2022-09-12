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
        XChain Create Account Attestation Batch Element
      </div>
      <SimpleRow label={t('send')} data-test="send">
        <Amount value={send} />
      </SimpleRow>
      <SimpleRow label={t('account')} data-test="account">
        <Account account={account} link={false} />
      </SimpleRow>
      <SimpleRow label={t('destination')} data-test="destination">
        <Account account={destination} />
      </SimpleRow>
    </div>
  )
}
