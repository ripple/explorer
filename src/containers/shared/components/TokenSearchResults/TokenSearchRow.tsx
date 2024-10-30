import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'
import { parsePrice, stripDomain } from './utils'
import Currency from '../Currency'

const renderLogo = (token) =>
  token.meta.token.icon ? (
    <object data={token.meta.token.icon} className="result-row-icon">
      <div className="result-row-icon" />
    </object>
  ) : (
    <div className="result-row-icon no-logo" />
  )

const renderName = (token) =>
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
      <div>
        {token.meta.issuer.name
          ? `${token.meta.issuer.name} (${token.issuer})`
          : token.issuer}
      </div>
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
    <Link to={`/token/${token.currency}.${token.issuer}`} onClick={onClick}>
      <div className="search-result-row">
        <div className="result-logo">{renderLogo(token)}</div>
        <div>
          <div className="result-name-line">
            <div className="result-currency">
              <Currency currency={token.currency} />
            </div>
            <div className="result-token-name">{renderName(token)}</div>
            <div className="metric-chip">
              <Amount
                value={{
                  currency: 'USD',
                  amount: parsePrice(token.metrics.price, xrpPrice),
                }}
                displayIssuer={false}
                modifier={
                  parsePrice(token.metrics.price, xrpPrice) === 0
                    ? '~'
                    : undefined
                }
              />
            </div>
            <div className="metric-chip">
              {t('holders', {
                holders: localizeNumber(token.metrics.holders),
              })}
            </div>
            <div className="metric-chip">
              <div>
                {t('trustlines', {
                  trustlines: localizeNumber(token.metrics.trustlines),
                })}
              </div>
            </div>
          </div>
          <div className="result-issuer-line">
            <div>{t('issuer')}:</div>
            {renderIssuerAddress(token, onClick)}
          </div>
          <div className="result-website-line">
            {token.meta.issuer.domain && (
              <>
                <div>{t('website')}:</div>
                <div>
                  <Link
                    to={`https://${token.meta.issuer.domain}/`}
                    className="issuer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stripDomain(token.meta.issuer.domain)}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
