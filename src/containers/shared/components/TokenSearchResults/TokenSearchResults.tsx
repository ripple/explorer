import { useContext, useEffect, useRef, useState } from 'react'
import './styles.scss'

import { useTranslation } from 'react-i18next'
import { useAnalytics } from '../../analytics'
import { TokenSearchRow } from './TokenSearchRow'
import SocketContext from '../../SocketContext'
import { getAccountLines } from '../../../../rippled/lib/rippled'

const ORACLE_ACCOUNT = 'rXUMMaPpZqPutoRszR29jtC8amWq3APkx'

interface SearchResultsProps {
  currentSearchValue: string
  setCurrentSearchInput: (string) => void
}

const SearchResults = ({
  currentSearchValue,
  setCurrentSearchInput,
}: SearchResultsProps): JSX.Element | null => {
  const analytics = useAnalytics()
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const xrplmetaWSRef = useRef<WebSocket | null>(null)
  const [tokens, setTokens] = useState<any[]>([])
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

      setTokens(filteredResults)
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

    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then((accountLines) =>
      setXRPUSDPrice(accountLines.lines[0]?.limit),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rippledSocket])

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
      setTokens([])
    }
  }, [currentSearchValue])

  const onLinkClick = () => {
    analytics.track('token_search_click', {
      search_category: 'token',
      search_term: currentSearchValue,
    })

    // clear current search on navigation
    setCurrentSearchInput('')
    setTokens([])
  }
  return tokens.length > 0 ? (
    <div className="search-results-menu">
      <div className="search-results-header">
        {t('tokens')} ({tokens.length})
      </div>
      <div>
        {tokens.map((token) => (
          <TokenSearchRow
            token={token}
            onClick={onLinkClick}
            xrpPrice={XRPUSDPrice}
            key={`${token.currency}.${token.issuer}`}
          />
        ))}
      </div>
    </div>
  ) : null
}

export default SearchResults
