// https://xrpl.org/currency-formats.html#nonstandard-currency-codes
import { RouteLink } from '../routing'
import { TOKEN } from '../../App/routes'

const NON_STANDARD_CODE_LENGTH = 40
const XRP = 'XRP'

export interface Props {
  issuer?: string
  currency: string
  link?: boolean
  shortenIssuer?: boolean
  displaySymbol?: boolean
}

/*
  TODO: LP token identifier is the identifier for LP tokens. All issued LP tokens start with 03 so we can use this to
  make sure we're only converting actual hex values.
 */
const Currency = (props: Props) => {
  const {
    issuer,
    currency,
    link = true,
    shortenIssuer = false,
    displaySymbol = true,
  } = props
  const LPTokenIdentifier = '03'
  const currencyCode =
    currency?.length === NON_STANDARD_CODE_LENGTH &&
    currency?.substring(0, 2) !== LPTokenIdentifier
      ? hexToString(currency)
      : currency

  let display = `${currencyCode}`

  if (currencyCode === XRP && displaySymbol) {
    display = `\uE900 ${display}`
  }

  if (issuer) {
    display += '.'
    display += shortenIssuer ? issuer.substring(0, 4) : issuer
  }

  const content =
    link && issuer ? (
      <RouteLink to={TOKEN} params={{ token: `${currency}.${issuer}` }}>
        {display}
      </RouteLink>
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
