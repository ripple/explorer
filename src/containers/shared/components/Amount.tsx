import React from 'react'
import { useTranslation } from 'react-i18next'
import { CURRENCY_OPTIONS, XRP_BASE } from '../transactionUtils'
import { localizeNumber } from '../utils'
import Currency from './Currency'

export interface AmountProps {
  value:
    | string
    | {
        issuer?: string
        currency: string
        amount: string
      }
  displayIssuer?: boolean
}

export const Amount = ({ displayIssuer = true, value }: AmountProps) => {
  const { i18n } = useTranslation()
  const issuer = typeof value === 'string' ? undefined : value.issuer
  const currency = typeof value === 'string' ? 'XRP' : value.currency
  const amount =
    typeof value === 'string' ? parseInt(value, 10) / XRP_BASE : value.amount

  const options = { ...CURRENCY_OPTIONS, currency }
  const localizedAmount = localizeNumber(amount, i18n.resolvedLanguage, options)

  return (
    <span className="amount">
      <span className="amount-localized">{localizedAmount}</span>{' '}
      <Currency issuer={displayIssuer ? issuer : ''} currency={currency} link />
    </span>
  )
}
