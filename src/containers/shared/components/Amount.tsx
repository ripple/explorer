import React from 'react'
import { CURRENCY_OPTIONS, XRP_BASE } from '../transactionUtils'
import { useLanguage } from '../hooks'
import { localizeNumber } from '../utils'
import Currency from './Currency'
import { ExplorerAmount } from '../types'

export interface AmountProps {
  displayIssuer?: boolean
  modifier?: `+` | '-' | '~' // value to put in front of the currency symbol and number
  value: ExplorerAmount
}

export const Amount = ({
  displayIssuer = true,
  modifier,
  value,
}: AmountProps) => {
  const language = useLanguage()
  const issuer = typeof value === 'string' ? undefined : value.issuer
  const currency = typeof value === 'string' ? 'XRP' : value.currency
  const amount =
    typeof value === 'string' ? parseInt(value, 10) / XRP_BASE : value.amount

  const options = { ...CURRENCY_OPTIONS, currency }
  const localizedAmount = localizeNumber(amount, language, options)

  return (
    <span className="amount">
      <span className="amount-localized">
        {modifier && <span className="amount-modifier">{modifier}</span>}
        {localizedAmount}
      </span>{' '}
      <Currency issuer={displayIssuer ? issuer : ''} currency={currency} link />
    </span>
  )
}
