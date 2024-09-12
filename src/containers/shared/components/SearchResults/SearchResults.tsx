import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { convertHexToString } from 'xrpl'
import { getRoute } from '../../../Header/Search'
import Logo from '../../images/info.svg'
import './SearchResults.scss'

import SocketContext from '../../SocketContext'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

let socket

const SearchResultBarNonToken = ({ type, path, onClick }) => {
  const generateBarText = () => {
    switch (type) {
      case 'ledgers':
        return 'Search ledger ID'
      case 'accounts':
        return 'Search account'
      case 'paystrings':
        return 'Search paystring'
      case 'token':
        return 'Search token'
      case 'validators':
        return 'Search validators'
      case 'transactions':
        return 'Search transactions'
      default:
        return null
    }
  }

  return (
    <Link to={path} onClick={onClick}>
      <div className="search-result-row">
        <Logo
          style={{
            width: '1.5rem',
            height: '1.5rem',
            margin: '1rem',
            marginRight: '50px',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        />
        <div
          style={{
            marginRight: '30px',
            width: '200px',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <h4>{generateBarText()}</h4>
        </div>
      </div>
    </Link>
  )
}

const SearchResultBar = ({ resultContent, onClick }) => (
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
          <div style={{ paddingTop: '2px', paddingBottom: '2px' }}>
            {resultContent.currency.length > 10
              ? convertHexToString(resultContent.currency)
              : resultContent.currency}
          </div>
          <div
            style={{
              paddingTop: '2px',
              paddingBottom: '2px',
              marginLeft: '0.25rem',
            }}
          >
            {resultContent.meta.token.name && (
              <div>({resultContent.meta.token.name})</div>
            )}
          </div>
          <div className="search-result-metric-chip">
            ${resultContent.metrics.price}
          </div>
          <div className="search-result-metric-chip">
            HOLDERS: {resultContent.metrics.holders}
          </div>
          <div className="search-result-metric-chip">
            TRUSTLINES: {resultContent.metrics.trustlines}
          </div>
        </div>
        <div className="search-result-row-line-two">
          <div>Address:</div>
          {resultContent.meta.issuer.name && (
            <div style={{ marginLeft: '0.25rem' }}>
              <div>{resultContent.issuer}</div>
            </div>
          )}
        </div>
        <div className="search-result-row-line-three">
          <div>Website</div>
          <div style={{ marginLeft: '0.25rem' }}>
            <div>{resultContent.meta.issuer.domain}</div>
          </div>
        </div>
      </div>
    </div>
  </Link>
)

const SearchResults = ({
  currentSearchValue,
  setCurrentSearchInput,
}: SearchResultsProps): JSX.Element => {
  const xrplSocket = useContext(SocketContext)
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState([])
  const [searchRouteObj, setSearchRouteObj] = useState({ type: '', path: '' })
  useEffect(() => {
    socket = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

    socket.addEventListener('open', (event) => {
      console.log('Connected!')
    })

    socket.addEventListener('message', (event) => {
      // console.log('Got message from server:', event.data)
      const results = JSON.parse(event.data).result.tokens
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
      limit: 50,
    }
    if (socket.readyState === socket.OPEN && currentSearchValue !== '') {
      socket.send(JSON.stringify(command))
    }
    if (currentSearchValue === '') {
      setRawCurrentSearchResults([])
    }

    getRoute(currentSearchValue, xrplSocket).then((routeObj) => {
      if (routeObj) {
        setSearchRouteObj(routeObj)
      } else {
        setSearchRouteObj({ type: '', path: '' })
      }
    })
  }, [currentSearchValue, socket])

  const onLinkClick = () => {
    setCurrentSearchInput('')
    setRawCurrentSearchResults([])
    setSearchRouteObj({ type: '', path: '' })
  }
  return (
    <div className="search-results-menu">
      {rawCurrentSearchResults.length > 0 && (
        <div className="search-results-header">
          Tokens ({rawCurrentSearchResults.length})
        </div>
      )}
      {searchRouteObj && searchRouteObj.path !== '' && (
        <SearchResultBarNonToken
          type={searchRouteObj.type}
          path={searchRouteObj.path}
          onClick={onLinkClick}
        />
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
