import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'
import Currency from '../Currency'
import DomainLink from '../DomainLink'
import { LOSToken } from '../../losTypes'

const parsePrice = (dollarPrice: string, xrpPrice: number): number => {
  const parsedDollar = Number(dollarPrice)
  return Number((parsedDollar * xrpPrice).toFixed(6))
}

const DEFAULT_VALUE = '--'

const TokenLogo: FC<{ token: LOSToken }> = ({ token }) =>
  token && token.icon ? (
    <object data={token.icon} className="result-row-icon">
      <div className="result-row-icon" />
    </object>
  ) : (
    <div className="result-row-icon no-logo" />
  )

const TokenName: FC<{ token: LOSToken }> = ({ token }) =>
  token && token.name ? (
    <div>
      ({token.name.trim().toUpperCase().replace('(', '').replace(')', '')})
    </div>
  ) : null

const IssuerAddress: FC<{ token: LOSToken; onClick: any }> = ({
  token,
  onClick,
}) =>
  token && token.issuer_account ? (
    <Link
      to={`/accounts/${token.issuer_account}`}
      onClick={onClick}
      className="issuer-link"
    >
      <div className="issuer-name">
        {token.issuer_name && `${token.issuer_name} (`}
      </div>
      <div className="issuer-address truncate">{token.issuer_account}</div>
      {token.issuer_name && <div>)</div>}
    </Link>
  ) : null

interface SearchResultRowProps {
  token: LOSToken
  onClick: () => void
  xrpPrice: number
}

export const TokenSearchRow = ({
  token,
  onClick,
  xrpPrice,
}: SearchResultRowProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Link
      to={`/token/${token.currency}.${token.issuer_account}`}
      className="search-result-row"
      onClick={onClick}
    >
      <div className="result-name-line">
        <div className="result-logo">
          <TokenLogo token={token} />
        </div>
        <div className="result-currency">
          <Currency currency={token.currency} />
        </div>
        <div className="result-token-name">
          <TokenName token={token} />
        </div>
        <div className="metric-chip">
          {token.price ? (
            <Amount
              value={{
                currency: 'USD',
                amount: parsePrice(token.price, xrpPrice),
              }}
              displayIssuer={false}
              modifier={
                parsePrice(token.price, xrpPrice) === 0 ? '~' : undefined
              }
            />
          ) : (
            <div className="no-price">{DEFAULT_VALUE}</div>
          )}
        </div>
        <div className="metric-chip">
          {t('holders_count', {
            holders: localizeNumber(token.holders),
          })}
        </div>
        <div className="metric-chip">
          {t('trustlines', {
            trustlines: localizeNumber(token.trustlines),
          })}
        </div>
      </div>
      <div className="result-issuer-line">
        <div className="issuer-title">{t('issuer')}:</div>
        <IssuerAddress token={token} onClick={onClick} />
      </div>
      <div className="result-website-line">
        {token.issuer_domain && (
          <>
            <div>{t('website')}:</div>
            <div className="result-domain-link">
              <DomainLink domain={token.issuer_domain} keepProtocol={false} />
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
