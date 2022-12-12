import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { localizeBalance, localizeNumber } from '../../../utils'
import { Account } from '../../Account'
import { Amount } from '../../Amount'

export const TRADE_FEE_TOTAL = 1000

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
  const bid = bidMin ? localizeBalance(bidMin) : undefined
  const tf = tradingFee
    ? localizeNumber(tradingFee / TRADE_FEE_TOTAL, 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : undefined
  const accList = authAccounts
    ? authAccounts.map((accID: string) => <Account account={accID} />)
    : undefined

  return (
    <>
      {accountID && (
        <SimpleRow label={t('account_id')}>
          <Account account={accountID} />
        </SimpleRow>
      )}
      {value && <SimpleRow label={t('asset1')}>{value}</SimpleRow>}
      {value2 && <SimpleRow label={t('asset2')}>{value2}</SimpleRow>}
      {lpTokenFormatted && (
        <SimpleRow label={t('lp_tokens')}>{lpTokenFormatted}</SimpleRow>
      )}
      {effectivePrice && (
        <SimpleRow label={t('effective_price')}>{effectivePrice}</SimpleRow>
      )}
      {tf && <SimpleRow label={t('trading_fee')}>%{tf}</SimpleRow>}
      {bid && <SimpleRow label={t('min_slot_price')}>{bid}</SimpleRow>}
      {accList && <SimpleRow label={t('auth_accounts')}>{accList}</SimpleRow>}
    </>
  )
}
