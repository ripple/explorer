import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../../SimpleRow'
import { TransactionSimpleProps } from '../../types'
import { localizeNumber } from '../../../../utils'
import { Account } from '../../../Account'
import { Amount } from '../../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { amount, amount2, lpTokens, accountID, ePrice, fee } =
    data.instructions
  const value =
    amount?.amount && amount.amount !== fee ? (
      <Amount value={amount} />
    ) : undefined
  const value2 =
    amount2?.amount && amount2.amount !== fee ? (
      <Amount value={amount2} />
    ) : undefined
  const lpTokenFormatted = lpTokens
    ? localizeNumber(lpTokens, 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : undefined

  return (
    <>
      {accountID && (
        <SimpleRow label={t('account_id')} data-test="account_id">
          <Account account={accountID} />
        </SimpleRow>
      )}
      {value && (
        <SimpleRow label={t('asset1in')} data-test="asset1">
          {value}
        </SimpleRow>
      )}
      {value2 && (
        <SimpleRow label={t('asset2in')} data-test="asset2">
          {value2}
        </SimpleRow>
      )}
      {ePrice && (
        <SimpleRow label={t('effective_price')} data-test="effective_price">
          <Amount value={ePrice} />
        </SimpleRow>
      )}
      {lpTokenFormatted && (
        <SimpleRow label={t('lp_tokens')} data-test="lp_tokens">
          {lpTokenFormatted}
        </SimpleRow>
      )}
    </>
  )
}
