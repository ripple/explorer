import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../../images/no_token_logo.svg'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'
import './SearchResultRow.scss'
import { convertHexToString } from '../../../../rippled/lib/utils'
import { parsePrice, stripDomain } from './utils'

const renderLogo = (resultContent) =>
  resultContent.meta.token.icon ? (
    <object data={resultContent.meta.token.icon} className="result-row-icon">
      <Logo className="result-row-icon" />
    </object>
  ) : (
    <Logo className="result-row-icon" />
  )

const renderCurrency = (resultContent) =>
  resultContent.currency.length > 10
    ? convertHexToString(resultContent.currency)!
        .replaceAll('\u0000', '')
        .trim()
    : resultContent.currency.trim()

const renderName = (resultContent) =>
  resultContent.meta.token.name && (
    <div>
      (
      {resultContent.meta.token.name
        .trim()
        .toUpperCase()
        .replace('(', '')
        .replace(')', '')}
      )
    </div>
  )

const renderIssuerAddress = (resultContent, onClick) =>
  resultContent.issuer && (
    <Link
      to={`/accounts/${resultContent.issuer}`}
      onClick={onClick}
      className="issuer-link"
    >
      <div>
        {resultContent.meta.issuer.name
          ? `${resultContent.meta.issuer.name} (${resultContent.issuer})`
          : resultContent.issuer}
      </div>
    </Link>
  )

interface SearchResultRowProps {
  resultContent: any
  onClick: () => void
  xrpPrice: number
}
export const SearchResultRow = ({
  resultContent,
  onClick,
  xrpPrice,
}: SearchResultRowProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Link
      to={`/token/${resultContent.currency}.${resultContent.issuer}`}
      onClick={onClick}
    >
      <div className="search-result-row">
        <div className="search-result-logo">{renderLogo(resultContent)}</div>
        <div className="search-result-content">
          <div className="result-name-line">
            <div className="result-currency">
              {renderCurrency(resultContent)}
            </div>
            <div className="result-token-name">{renderName(resultContent)}</div>
            <div className="metric-chip">
              <Amount
                value={{
                  currency: 'USD',
                  amount: parsePrice(resultContent.metrics.price, xrpPrice),
                }}
                displayIssuer={false}
                modifier={
                  parsePrice(resultContent.metrics.price, xrpPrice) === 0
                    ? '~'
                    : undefined
                }
              />
            </div>
            <div className="metric-chip">
              {t('holders', {
                holders: localizeNumber(resultContent.metrics.holders),
              })}
            </div>
            <div className="metric-chip">
              <div>
                {t('trustlines', {
                  trustlines: localizeNumber(resultContent.metrics.trustlines),
                })}
              </div>
            </div>
          </div>
          <div className="result-issuer-line">
            <div>{t('issuer')}:</div>
            {renderIssuerAddress(resultContent, onClick)}
          </div>
          <div className="result-website-line">
            {resultContent.meta.issuer.domain && (
              <>
                <div>{t('website')}:</div>
                <div>
                  <Link
                    to={`https://${resultContent.meta.issuer.domain}/`}
                    className="issuer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stripDomain(resultContent.meta.issuer.domain)}
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
