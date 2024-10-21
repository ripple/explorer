import { Link } from 'react-router-dom'
import { convertHexToString } from 'xrpl'
import Logo from '../../images/no_token_logo.svg'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'

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
  const parsePrice = (price): number => {
    const parsed = Number(price).toFixed(6)
    if (Number(parsed) === 0) {
      return 0
    }
    return Number(Number(parseFloat(parsed) * xrpPrice).toFixed(6))
  }

  const parseDomain = (domain: string): string => {
    let result = domain

    if (domain.startsWith('www.')) {
      result = result.substring(4)
    } else if (domain.startsWith('http://')) {
      result = result.substring(7)
    } else if (domain.startsWith('https://')) {
      result = result.substring(8)
    }

    if (domain.endsWith('/')) {
      result = result.substring(0, result.length - 1)
    }

    return result
  }

  return (
    <Link
      to={`/token/${resultContent.currency}.${resultContent.issuer}`}
      onClick={onClick}
    >
      <div className="search-result-row">
        <div className="search-result-logo">
          {resultContent.meta.token.icon ? (
            <object
              data={resultContent.meta.token.icon}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '16px',
              }}
            >
              <Logo
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '16px',
                }}
              />
            </object>
          ) : (
            <Logo
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '16px',
              }}
            />
          )}
        </div>
        <div className="search-result-content">
          <div className="search-result-row-line-one">
            <div
              style={{
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingRight: '0px',
              }}
            >
              {resultContent.currency.length > 10
                ? convertHexToString(resultContent.currency)
                    .replaceAll('\u0000', '')
                    .trim()
                : resultContent.currency.trim()}
            </div>
            <div
              style={{
                paddingTop: '2px',
                paddingBottom: '2px',
                marginLeft: '3px',
              }}
            >
              {resultContent.meta.token.name && (
                <div>
                  (
                  {resultContent.meta.token.name
                    .trim()
                    .toUpperCase()
                    .replace('(', '')
                    .replace(')', '')}
                  )
                </div>
              )}
            </div>
            <div className="search-result-metric-chip">
              <Amount
                value={{
                  currency: 'USD',
                  amount: parsePrice(resultContent.metrics.price),
                }}
                displayIssuer={false}
                modifier={
                  parsePrice(resultContent.metrics.price) === 0
                    ? '~'
                    : undefined
                }
              />
            </div>
            <div className="search-result-metric-chip">
              HOLDERS: {localizeNumber(resultContent.metrics.holders)}
            </div>
            <div className="search-result-metric-chip">
              <div>
                TRUSTLINES: {localizeNumber(resultContent.metrics.trustlines)}
              </div>
            </div>
          </div>
          <div className="search-result-row-line-two">
            <div>Issuer:</div>
            {resultContent.issuer && (
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
            )}
          </div>
          <div className="search-result-row-line-three">
            {resultContent.meta.issuer.domain && (
              <>
                <div>Website:</div>
                <div>
                  <Link
                    to={`https://${resultContent.meta.issuer.domain}/`}
                    className="issuer-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {parseDomain(resultContent.meta.issuer.domain)}
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
