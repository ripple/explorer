import { RouteLink } from '../routing'
import { TOKEN_ROUTE, MPT_ROUTE } from '../../App/routes'

// https://xrpl.org/currency-formats.html#nonstandard-currency-codes
const NON_STANDARD_CODE_LENGTH = 40
const XRP = 'XRP'
const LP_TOKEN_IDENTIFIER = '03'

export interface Props {
  issuer?: string
  currency: string
  link?: boolean
  shortenIssuer?: boolean
  displaySymbol?: boolean
  isMPT?: boolean
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
    isMPT = false,
  } = props
  let content: string

  if (isMPT) {
    const display = `MPT (${currency})`
    if (link)
      return (
        <RouteLink
          className="currency"
          data-testid="currency"
          to={MPT_ROUTE}
          params={{ id: currency }}
        >
          {display}
        </RouteLink>
      )
    content = display
  } else {
    let currencyCode =
      currency?.length === NON_STANDARD_CODE_LENGTH &&
      currency?.substring(0, 2) !== LP_TOKEN_IDENTIFIER
        ? hexToString(currency)
        : currency

    if (
      currency?.length === NON_STANDARD_CODE_LENGTH &&
      currencyCode.length === 3
    ) {
      currencyCode = `Fake${currencyCode}`
    }

    let display = `${currencyCode}`

    if (currencyCode === XRP && displaySymbol) {
      display = `\uE900 ${display}`
    }

    if (issuer) {
      display += '.'
      display += shortenIssuer ? issuer.substring(0, 4) : issuer
    }

    if (link && issuer)
      return (
        <RouteLink
          className="currency"
          to={TOKEN_ROUTE}
          data-testid="currency"
          params={{ token: `${currency}.${issuer}` }}
        >
          {display}
        </RouteLink>
      )
    content = display
  }

  return (
    <span className="currency" data-testid="currency">
      {content}
    </span>
  )
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
