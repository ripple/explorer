import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { formatTradingFee } from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const { amount, amount2, fee, tradingFee, ammAccountID } = data.instructions
  const value =
    amount?.amount && amount.amount !== fee ? (
      <Amount value={amount} />
    ) : undefined
  const value2 =
    amount2?.amount && amount2.amount !== fee ? (
      <Amount value={amount2} />
    ) : undefined
  const tf = formatTradingFee(tradingFee)

  return (
    <>
      {ammAccountID && (
        <SimpleRow label={t('amm_account_id')} data-test="account_id">
          <Account account={ammAccountID} />
        </SimpleRow>
      )}
      {value && (
        <SimpleRow label={t('asset1')} data-test="asset1">
          {value}
        </SimpleRow>
      )}
      {value2 && (
        <SimpleRow label={t('asset2')} data-test="asset2">
          {value2}
        </SimpleRow>
      )}
      {tf && (
        <SimpleRow label={t('trading_fee')} data-test="trading_fee">
          %{tf}
        </SimpleRow>
      )}
    </>
  )
}
