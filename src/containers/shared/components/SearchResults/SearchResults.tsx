import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertHexToString } from 'xrpl'
import Logo from '../../images/generic_token.svg'
import './SearchResults.scss'
import ExternalLogo from '../../images/external_link.svg'

import SocketContext from '../../SocketContext'
import { Amount } from '../Amount'
import { localizeNumber } from '../../utils'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

const SearchResultBar = ({ resultContent, onClick }) => {
  const parsePrice = (price) => {
    const parsed = Number(price).toFixed(6)
    if (Number(parsed) === 0) {
      return 0
    }
    return parseFloat(parsed)
  }

  const parseDomain = (domain: string) => {
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
              }}
            >
              {resultContent.currency.length > 10
                ? convertHexToString(resultContent.currency).trim()
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
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <a
                    href={`https://${resultContent.meta.issuer.domain}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="website-link"
                  >
                    <div>{parseDomain(resultContent.meta.issuer.domain)}</div>
                  </a>
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
  const xrplSocket = useContext(SocketContext)
  const xrplmetaWSRef = useRef<WebSocket | null>(null)
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState([])
  const [totalTokenCount, setTotalTokenCount] = useState(0)

  const connect = () => {
    xrplmetaWSRef.current = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

    xrplmetaWSRef.current.onopen = () => {
      console.log('Connected')
    }

    xrplmetaWSRef.current.onmessage = (event) => {
      console.log('Message from server:', event.data)

      console.log('Got message from server:', event.data)
      const results = JSON.parse(event.data).result.tokens
      setTotalTokenCount(JSON.parse(event.data).result.count)
      console.log(totalTokenCount)
      const filteredResults = results.filter(
        (result) =>
          result.metrics.trustlines > 50 &&
          result.metrics.holders > 50 &&
          result.metrics.marketcap > 0 &&
          result.metrics.volume_7d > 0,
      )
      console.log(filteredResults)
      setRawCurrentSearchResults(filteredResults)
    }

    xrplmetaWSRef.current.onclose = () => {
      console.log('Disconnected. Reconnecting...')
      attemptReconnect()
    }

    xrplmetaWSRef.current.onerror = (error) => {
      console.error('XRPLMeta error:', error)
      xrplmetaWSRef.current?.close()
    }
  }

  const attemptReconnect = () => {
    // Exponential backoff logic
    setTimeout(() => {
      connect()
    }, 500)
  }

  // establish socket and watch for xrplmeta responses
  useEffect(() => {
    connect()
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
      {rawCurrentSearchResults.map((searchResultContent) => (
        <SearchResultBar
          resultContent={searchResultContent}
          onClick={onLinkClick}
          key={`${searchResultContent.currency}.${searchResultContent.issuer}`}
        />
      ))}
    </div>
  )
}

export default SearchResults
