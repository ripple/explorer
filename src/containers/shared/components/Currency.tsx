import React from 'react'
import { Link } from 'react-router-dom'

// https://xrpl.org/currency-formats.html#nonstandard-currency-codes
const NON_STANDARD_CODE_LENGTH = 40

export interface Props {
  issuer?: string
  currency: string
  link?: boolean
  showIssuer?: boolean
}

const Currency = (props: Props) => {
  const { issuer, currency, link = true, showIssuer = true } = props
  const currencyCode =
    currency?.length === NON_STANDARD_CODE_LENGTH
      ? hexToString(currency)
      : currency

  const display =
    issuer && showIssuer ? `${currencyCode}.${issuer}` : currencyCode
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
