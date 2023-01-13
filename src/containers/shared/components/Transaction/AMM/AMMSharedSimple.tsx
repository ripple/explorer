import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import {
  localizeBalance,
  localizeNumber,
  formatTradingFee,
} from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const Simple = ({ data }: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const {
    amount,
    amount2,
    lpTokens,
    accountID,
    effectivePrice,
    fee,
    tradingFee,
    bidMin,
    bidMax,
    authAccounts,
  } = data.instructions
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
  const localizedBidMin = bidMin ? localizeBalance(bidMin) : undefined
  const localizedBidMax = bidMax ? localizeBalance(bidMax) : undefined
  const tf = tradingFee ? formatTradingFee(tradingFee) : undefined

  return (
    <>
      {accountID && (
        <SimpleRow label={t('account_id')} data-test="account_id">
          <Account account={accountID} />
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
      {lpTokenFormatted && (
        <SimpleRow label={t('lp_tokens')} data-test="lp_tokens">
          {lpTokenFormatted}
        </SimpleRow>
      )}
      {effectivePrice && (
        <SimpleRow label={t('effective_price')} data-test="effective_price">
          {effectivePrice}
        </SimpleRow>
      )}
      {tf && (
        <SimpleRow label={t('trading_fee')} data-test="trading_fee">
          %{tf}
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
