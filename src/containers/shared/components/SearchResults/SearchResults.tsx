import { useEffect, useRef, useState } from 'react'
import './SearchResults.scss'

import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const xrplmetaWSRef = useRef<WebSocket | null>(null)
  const [currentSearchResults, setCurrentSearchResults] = useState<any[]>([])
  const [XRPUSDPrice, setXRPUSDPrice] = useState(0.0)

  const connectXRPLMeta = () => {
    xrplmetaWSRef.current = new WebSocket(
      process.env.XRPL_META_LINK || '',
      'tokens',
    )

    xrplmetaWSRef.current.onmessage = (event) => {
      const results = JSON.parse(event.data).result.tokens

      // prevent illegitimate results by filtering out low usage tokens
      const filteredResults = results.filter(
        (result) =>
          result.metrics.trustlines > 50 &&
          result.metrics.holders > 50 &&
          result.metrics.marketcap > 0 &&
          result.metrics.volume_7d > 0,
      )

      setCurrentSearchResults(filteredResults)
    }

    xrplmetaWSRef.current.onclose = () => {
      attemptXRPLMetaReconnect()
    }

    xrplmetaWSRef.current.onerror = () => {
      xrplmetaWSRef.current?.close()
      attemptXRPLMetaReconnect()
    }
  }

  const attemptXRPLMetaReconnect = () => {
    setTimeout(() => {
      connectXRPLMeta()
    }, 500)
  }

  useEffect(() => {
    connectXRPLMeta()

    // xrpl cluster temporary socket connection for XRP/USD conversion rate
    // to be replaced by actual oracles once amendment goes live
    const xrplClusterSocket = new WebSocket(process.env.XRPL_CLUSTER_LINK || '')
    const clusterConversionRateCommand = {
      command: 'account_lines',
      account: 'rXUMMaPpZqPutoRszR29jtC8amWq3APkx',
      limit: 1,
    }

    xrplClusterSocket.onopen = () => {
      xrplClusterSocket.send(JSON.stringify(clusterConversionRateCommand))
    }

    xrplClusterSocket.onmessage = (event) => {
      setXRPUSDPrice(JSON.parse(event.data).result.lines[0].limit)
      xrplClusterSocket.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // watch for user input changes and send to XRPLMeta
  useEffect(() => {
    const tokenSearchCommand = {
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
      xrplmetaWSRef.current?.send(JSON.stringify(tokenSearchCommand))
    }

    // clear out results and prevent search input/results cache discrepancies
    if (currentSearchValue === '') {
      setCurrentSearchResults([])
    }
  }, [currentSearchValue])

  const onLinkClick = () => {
    analytics.track('token_search_click', {
      search_category: 'token',
      search_term: currentSearchValue,
    })

    // clear current search on navigation
    setCurrentSearchInput('')
    setCurrentSearchResults([])
  }
  return (
    <div>
      {currentSearchResults.length > 0 && (
        <div className="search-results-menu">
          <div className="search-results-header">
            {t('tokens')} ({currentSearchResults.length})
          </div>
          <div className="scrollable-search-results">
            {currentSearchResults.map((searchResultContent) => (
              <SearchResultRow
                resultContent={searchResultContent}
                onClick={onLinkClick}
                xrpPrice={XRPUSDPrice}
                key={`${searchResultContent.currency}.${searchResultContent.issuer}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults
