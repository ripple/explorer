import { useEffect, useState } from 'react'
import Logo from '../../images/info.svg'
import './SearchResults.scss'
import { Link } from 'react-router-dom'
import { RouteLink } from '../../routing'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

let socket

const truncateShort = (str: string | undefined) => {
  if (str) {
    return str.length > 10 ? `${str.substring(0, 7)}...` : str
  }
  return str
}

const truncateLong = (str: string | undefined) => {
  if (str) {
    return str.length > 10 ? `${str.substring(0, 10)}...` : str
  }
  return str
}

const SearchResultBar = ({ resultContent, onClick }) => (
  <Link
    to={`/token/${resultContent.currency}.${resultContent.issuer}`}
    onClick={onClick}
  >
    <div className="search-result-row">
      {resultContent.meta.token.icon ? (
        <img
          src={resultContent.meta.token.icon}
          alt="token icon"
          style={{
            width: '2rem',
            height: '2rem',
            margin: '1rem',
            marginRight: '50px',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        />
      ) : (
        <Logo
          style={{
            width: '2rem',
            height: '2rem',
            minWidth: '2rem',
            minHeight: '2rem',
            margin: '1rem',
            marginRight: '50px',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        />
      )}
      <div
        style={{
          marginRight: '30px',
          width: '100px',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        <h4>{truncateShort(resultContent.currency)}</h4>
      </div>
      <div style={{ marginRight: '30px', width: '150px', minWidth: '100px' }}>
        {resultContent.meta.token.name ? (
          <h4>{truncateLong(resultContent.meta.token.name)}</h4>
        ) : (
          <h4>----</h4>
        )}
      </div>

      {resultContent.meta.issuer.name ? (
        <div style={{ width: '150px', minWidth: '100px', marginRight: '30px' }}>
          <h5>{truncateLong(resultContent.meta.issuer.name)}</h5>
        </div>
      ) : (
        <div style={{ width: '150px', minWidth: '100px' }}>
          <h4>{truncateLong(resultContent.issuer)}</h4>
        </div>
      )}
    </div>
  </Link>
)

const SearchResults = ({
  currentSearchValue,
  setCurrentSearchInput,
}: SearchResultsProps): JSX.Element => {
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState([])
  useEffect(() => {
    socket = new WebSocket('wss://s1.xrplmeta.org', 'tokens')

    socket.addEventListener('open', (event) => {
      console.log('Connected!')
    })

    socket.addEventListener('message', (event) => {
      console.log('Got message from server:', event.data)
      setRawCurrentSearchResults(JSON.parse(event.data).result.tokens)
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
      limit: 10,
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
      {rawCurrentSearchResults.map((searchResultContent) => (
        <SearchResultBar
          resultContent={searchResultContent}
          onClick={onLinkClick}
        />
      ))}
    </div>
  )
}

export default SearchResults
