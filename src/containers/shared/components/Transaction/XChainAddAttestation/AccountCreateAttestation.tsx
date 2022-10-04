import React from 'react'
import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { AccountCreateAttestationInstructions } from './types'

export const AccountCreateAttestation = (
  props: AccountCreateAttestationInstructions,
  index: number,
) => {
  const { t } = useTranslation()
  const { send, account, destination } = props

  return (
    <div className="attestation" key={index}>
      <div className="attestation-title">
        {t('xchain_create_account_attestation')}
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
