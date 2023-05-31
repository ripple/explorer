import { Link } from 'react-router-dom'

// https://xrpl.org/currency-formats.html#nonstandard-currency-codes
const NON_STANDARD_CODE_LENGTH = 40

export interface Props {
  issuer?: string
  currency: string
  link?: boolean
  shortenIssuer?: boolean
}

/*
  TODO: LP token identifier is the identifier for LP tokens. All issued LP tokens start with 03 so we can use this to
  make sure we're only converting actual hex values.
 */
const Currency = (props: Props) => {
  const { issuer, currency, link = true, shortenIssuer = false } = props
  const LPTokenIdentifier = '03'
  const currencyCode =
    currency?.length === NON_STANDARD_CODE_LENGTH &&
    currency?.substring(0, 2) !== LPTokenIdentifier
      ? hexToString(currency)
      : currency

  let display = `${currencyCode}`

  if (issuer) {
    display += '.'
    display += shortenIssuer ? issuer.substring(0, 4) : issuer
  }

  const content =
    link && issuer ? (
      <Link to={`/token/${currency}.${issuer}`}>{display}</Link>
    ) : (
      display
    )

  return <span className="currency">{content}</span>
}

export const hexToString = (hex: string) => {
  let string = ''
  for (let i = 0; i < hex.length; i += 2) {
    const part = hex.substring(i, i + 2)
    const code = parseInt(part, 16)
    if (!isNaN(code) && code !== 0) {
      string += String.fromCharCode(code)
    }
  }
  return string
}

export default Currency
