import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { localizeBalance } from '../../../utils'
import { Account } from '../../Account'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { ammAccountID, bidMin, bidMax, authAccounts } = data.instructions
  const localizedBidMin = localizeBalance(bidMin)
  const localizedBidMax = localizeBalance(bidMax)

  return (
    <>
      {ammAccountID && (
        <SimpleRow label={t('amm_account_id')} data-test="account_id">
          <Account account={ammAccountID} />
        </SimpleRow>
      )}
      {localizedBidMin && (
        <SimpleRow label={t('min_slot_price')} data-test="min_slot_price">
          {localizedBidMin}
        </SimpleRow>
      )}
      {localizedBidMax && (
        <SimpleRow label={t('max_slot_price')} data-test="max_slot_price">
          {localizedBidMax}
        </SimpleRow>
      )}
      {authAccounts && (
        <SimpleRow label={t('auth_accounts')} data-test="auth_accounts">
          {authAccounts.map((accID: string) => (
            <Account account={accID} />
          ))}
        </SimpleRow>
      )}
    </>
  )
}
