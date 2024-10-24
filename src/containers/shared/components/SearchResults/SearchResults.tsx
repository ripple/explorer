import { useEffect, useRef, useState } from 'react'
import './SearchResults.scss'

import { useAnalytics } from '../../analytics'
import { SearchResultRow } from './SearchResultRow'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

const SearchResults = ({
  currentSearchValue,
  setCurrentSearchInput,
}: SearchResultsProps): JSX.Element => {
  const analytics = useAnalytics()
  const xrplmetaWSRef = useRef<WebSocket | null>(null)
  const [rawCurrentSearchResults, setRawCurrentSearchResults] = useState<any[]>(
    [],
  )
  const [XRPUSDPrice, setXRPUSDPrice] = useState(0.0)

  const connect = () => {
    xrplmetaWSRef.current = new WebSocket(
      process.env.XRPL_META_LINK || '',
      'tokens',
    )

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
    setTimeout(() => {
      connect()
    }, 500)
  }

  // xrpl cluster temporary socket connection for XRP/USD conversion rate
  useEffect(() => {
    connect()
    const xrplClusterSocket = new WebSocket(process.env.XRPL_CLUSTER_LINK || '')
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
    setRawCurrentSearchResults([])
    analytics.track('token_search', {
      search_category: 'token',
      search_term: currentSearchValue,
    })
    setCurrentSearchInput('')
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
          <SearchResultRow
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
