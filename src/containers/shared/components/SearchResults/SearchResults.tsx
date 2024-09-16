import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertHexToString } from 'xrpl'
import Logo from '../../images/generic_token.svg'
import './SearchResults.scss'
import ExternalLogo from '../../images/external_link.svg'

import SocketContext from '../../SocketContext'
import { Amount } from '../Amount'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

let socket

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
              HOLDERS: {resultContent.metrics.holders}
            </div>
            <div className="search-result-metric-chip">
              <div>TRUSTLINES: {resultContent.metrics.trustlines}</div>
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
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState([])
  const [totalTokenCount, setTotalTokenCount] = useState(0)
  useEffect(() => {
    socket = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

    socket.addEventListener('open', (event) => {
      console.log('Connected!')
    })

    socket.addEventListener('message', (event) => {
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
    })
    socket.addEventListener('close', (event) => {
      console.log('Disconnected...')
    })
  }, [])
  useEffect(() => {
    const command = {
      command: 'tokens',
      name_like: currentSearchValue,
      trust_level: [1, 2, 3],
      sort_by: 'holders',
      limit: 20,
    }
    if (socket.readyState === socket.OPEN && currentSearchValue !== '') {
      socket.send(JSON.stringify(command))
    }
    if (currentSearchValue === '') {
      setRawCurrentSearchResults([])
    }
  }, [currentSearchValue, socket])

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
