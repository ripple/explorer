import { CURRENCY_OPTIONS, XRP_BASE } from '../transactionUtils'
import { useLanguage } from '../hooks'
import { localizeNumber } from '../utils'
import Currency from './Currency'
import { ExplorerAmount } from '../types'

export interface AmountProps {
  value: ExplorerAmount | string
  displayIssuer?: boolean
  modifier?: `+` | '-' | '~' // value to put in front of the currency symbol and number
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
  const isMPT = typeof value === 'string' ? false : value.isMPT

  const options = { ...CURRENCY_OPTIONS, currency }
  // If it's an MPT, we can use as it is because we don't need decimal
  const localizedAmount =
    isMPT && typeof value !== 'string'
      ? value.amount
      : localizeNumber(amount, language, options)

  return (
    <span className="amount">
      <span className="amount-localized">
        {modifier && <span className="amount-modifier">{modifier}</span>}
        {localizedAmount}
      </span>{' '}
      <Currency
        issuer={displayIssuer ? issuer : ''}
        currency={currency}
        link
        displaySymbol={false}
        isMPT={isMPT}
      />
    </span>
  )
}
