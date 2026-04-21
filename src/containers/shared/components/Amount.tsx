import { CURRENCY_OPTIONS, XRP_BASE } from '../transactionUtils'
import { useLanguage, useMPTIssuance } from '../hooks'
import { localizeNumber, convertScaledPrice } from '../utils'
import { parseAmount } from '../NumberFormattingUtils'
import Currency from './Currency'
import { ExplorerAmount } from '../types'

export interface AmountProps {
  value: ExplorerAmount | string
  displayIssuer?: boolean
  modifier?: `+` | '-' | '~' // value to put in front of the currency symbol and number
  shortenIssuer?: boolean
  displayCurrency?: boolean
  /** Format amount with parseAmount instead of localizeNumber. */
  useParseAmount?: boolean
}

export const Amount = ({
  displayIssuer = true,
  modifier,
  value,
  shortenIssuer = false,
  displayCurrency = true,
  useParseAmount: useParsed = false,
}: AmountProps) => {
  const language = useLanguage()

  // Handle the special case where amount is '< 0.0001' string
  const isSmallAmountString =
    typeof value === 'object' && value.amount === '< 0.0001'

  const issuer = typeof value === 'string' ? undefined : value.issuer
  const currency = typeof value === 'string' ? 'XRP' : value.currency
  const amount =
    typeof value === 'string' ? parseInt(value, 10) / XRP_BASE : value.amount
  const isMPT = typeof value === 'string' ? false : (value.isMPT ?? false)

  const options = { ...CURRENCY_OPTIONS, currency }

  const mptID = isMPT ? (value as ExplorerAmount).currency : null
  const { data: mptIssuanceData } = useMPTIssuance(mptID, isMPT)

  const renderAmount = (localizedAmount: any) => (
    <span className="amount" data-testid="amount">
      <span className="amount-localized" data-testid="amount-localized">
        {modifier && <span className="amount-modifier">{modifier}</span>}
        {localizedAmount}
      </span>
      {displayCurrency && (
        <>
          {' '}
          <Currency
            issuer={displayIssuer ? issuer : ''}
            currency={currency}
            link
            displaySymbol={false}
            isMPT={isMPT}
            shortenIssuer={shortenIssuer}
          />
        </>
      )}
    </span>
  )

  // Handle the special case where amount is '< 0.0001'
  if (isSmallAmountString) {
    return renderAmount('< 0.0001')
  }

  // if amount is MPT type, we need to fetch the scale from the MPTokenIssuance
  // object so we can show the scaled amount
  if (isMPT && typeof value !== 'string') {
    if (mptIssuanceData) {
      const scale = mptIssuanceData.assetScale ?? 0
      const scaledAmount = convertScaledPrice(
        parseInt(amount as string, 10).toString(16),
        scale,
      )

      return renderAmount(localizeNumber(scaledAmount, language, {}, true))
    }
    return null
  }

  if (useParsed) {
    return renderAmount(parseAmount(amount, 1, language))
  }

  return renderAmount(localizeNumber(amount, language, options))
}
