import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertHexToString } from 'xrpl'
import Logo from '../../images/no_token_logo.svg'
import './SearchResults.scss'

import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

interface SearchResultBarProps {
  resultContent: any
  onClick: () => void
  xrpPrice: number
}
const SearchResultBar = ({
  resultContent,
  onClick,
  xrpPrice,
}: SearchResultBarProps): JSX.Element => {
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

const SearchResults = ({
  currentSearchValue,
  setCurrentSearchInput,
}: SearchResultsProps): JSX.Element => {
  const xrplmetaWSRef = useRef<WebSocket | null>(null)
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState<any[]>(
    [],
  )
  const [XRPUSDPrice, setXRPUSDPrice] = useState(0.0)

  const connect = () => {
    xrplmetaWSRef.current = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

    xrplmetaWSRef.current.onmessage = (event) => {
      const results = JSON.parse(event.data).result.tokens

      const filteredResults = results.filter(
        (result) =>
          result.metrics.trustlines > 50 &&
          result.metrics.holders > 50 &&
          result.metrics.marketcap > 0 &&
          result.metrics.volume_7d > 0,
      )

      setRawCurrentSearchResults(filteredResults)
    }

    xrplmetaWSRef.current.onclose = () => {
      attemptReconnect()
    }

    xrplmetaWSRef.current.onerror = () => {
      xrplmetaWSRef.current?.close()
      attemptReconnect()
    }
  }

  const attemptReconnect = () => {
    // Exponential backoff logic
    setTimeout(() => {
      connect()
    }, 500)
  }

  // xrpl cluster temporary socket connection for XRP/USD conversion rate
  useEffect(() => {
    connect()
    const xrplClusterSocket = new WebSocket('wss://xrplcluster.com')
    const clusterCommand = {
      command: 'account_lines',
      account: 'rXUMMaPpZqPutoRszR29jtC8amWq3APkx',
      limit: 1,
    }

    xrplClusterSocket.onopen = () => {
      xrplClusterSocket.send(JSON.stringify(clusterCommand))
    }

    xrplClusterSocket.onmessage = (event) => {
      const results = JSON.parse(event.data).result.lines[0].limit
      setXRPUSDPrice(results)
      xrplClusterSocket.close()
    }
  }, [])

  // watch for user input changes
  useEffect(() => {
    const command = {
      command: 'tokens',
      name_like: currentSearchValue,
      trust_level: [1, 2, 3],
      sort_by: 'holders',
      limit: 20,
    }
    if (
      xrplmetaWSRef.current?.readyState === xrplmetaWSRef.current?.OPEN &&
      currentSearchValue !== ''
    ) {
      xrplmetaWSRef.current?.send(JSON.stringify(command))
    }
    if (currentSearchValue === '') {
      setRawCurrentSearchResults([])
    }
  }, [currentSearchValue])

  const onLinkClick = () => {
    setCurrentSearchInput('')
    setRawCurrentSearchResults([])
  }
  return (
    <div className="search-results-menu">
      {rawCurrentSearchResults.length > 0 && (
        <div className="search-results-header">
          Tokens ({rawCurrentSearchResults.length})
        </div>
      )}
      <div className="scrollable-search-results">
        {rawCurrentSearchResults.map((searchResultContent) => (
          <SearchResultBar
            resultContent={searchResultContent}
            onClick={onLinkClick}
            xrpPrice={XRPUSDPrice}
            key={`${searchResultContent.currency}.${searchResultContent.issuer}`}
          />
        ))}
      </div>
    </div>
  )
}

export default SearchResults
