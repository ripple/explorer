import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'
import Currency from '../Currency'
import DomainLink from '../DomainLink'

const parsePrice = (dollarPrice: string, xrpPrice: number): number => {
  const parsedDollar = Number(dollarPrice)
  return Number((parsedDollar * xrpPrice).toFixed(6))
}

const TokenLogo: FC<{ token: any }> = ({ token }) =>
  token.meta.token.icon ? (
    <object data={token.meta.token.icon} className="result-row-icon">
      <div className="result-row-icon" />
    </object>
  ) : (
    <div className="result-row-icon no-logo" />
  )

const TokenName: FC<{ token: any }> = ({ token }) =>
  token.meta.token.name && (
    <div>
      (
      {token.meta.token.name
        .trim()
        .toUpperCase()
        .replace('(', '')
        .replace(')', '')}
      )
    </div>
  )

const renderIssuerAddress = (token, onClick) =>
  token.issuer && (
    <Link
      to={`/accounts/${token.issuer}`}
      onClick={onClick}
      className="issuer-link"
    >
      <div className="issuer-name">
        {token.meta.issuer.name ? `${token.meta.issuer.name} (` : token.issuer}
      </div>
      <div className="issuer-address truncate">{token.issuer}</div>
      <div>)</div>
    </Link>
  )

interface SearchResultRowProps {
  token: any
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
      to={`/token/${token.currency}.${token.issuer}`}
      className="search-result-row"
      onClick={onClick}
    >
      <div className="result-name-line">
        <div className="result-logo">{TokenLogo(token)}</div>
        <div className="result-currency">
          <Currency currency={token.currency} />
        </div>
        <div className="result-token-name">{TokenName(token)}</div>
        <div className="metric-chip">
          <Amount
            value={{
              currency: 'USD',
              amount: parsePrice(token.metrics.price, xrpPrice),
            }}
            displayIssuer={false}
            modifier={
              parsePrice(token.metrics.price, xrpPrice) === 0 ? '~' : undefined
            }
          />
        </div>
        <div className="metric-chip">
          {t('holders', {
            holders: localizeNumber(token.metrics.holders),
          })}
        </div>
        <div className="metric-chip">
          {t('trustlines', {
            trustlines: localizeNumber(token.metrics.trustlines),
          })}
        </div>
      </div>
      <div className="result-issuer-line">
        <div className="issuer-title">{t('issuer')}:</div>
        {renderIssuerAddress(token, onClick)}
      </div>
      <div className="result-website-line">
        {token.meta.issuer.domain && (
          <>
            <div>{t('website')}:</div>
            <div className="result-domain-link">
              <DomainLink
                domain={token.meta.issuer.domain}
                keepProtocol={false}
              />
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
