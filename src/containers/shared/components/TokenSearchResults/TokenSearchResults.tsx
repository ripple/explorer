import { useContext, useEffect, useState } from 'react'
import './styles.scss'

import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useAnalytics } from '../../analytics'
import { TokenSearchRow } from './TokenSearchRow'
import SocketContext from '../../SocketContext'
import Log from '../../log'
import { getAccountLines } from '../../../../rippled/lib/rippled'
import { FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS } from '../../utils'

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
  const [tokens, setTokens] = useState<any[]>([])
  const [XRPUSDPrice, setXRPUSDPrice] = useState(0.0)

  useQuery(['fetchXRPToUSDRate'], () => fetchXRPToUSDRate(), {
    refetchInterval: FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  })

  useQuery(['fetchTokens', currentSearchValue], () => fetchTokens())

  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1)
      .then((accountLines) => setXRPUSDPrice(accountLines.lines[0]?.limit))
      .catch((e) => Log.error(e))

  const fetchTokens = async () => {
    if (currentSearchValue !== '') {
      axios
        .get(`/api/v1/tokens/search/${currentSearchValue}`)
        .then((resp) => setTokens(resp.data.tokens))
        .catch((e) => Log.error(e))
    } else {
      setTokens([]) // clear out results and prevent search input/results cache discrepancies
    }
  }

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

      {tokens.map((token) => (
        <TokenSearchRow
          token={token}
          onClick={onLinkClick}
          xrpPrice={XRPUSDPrice}
          key={`${token.currency}.${token.issuer}`}
        />
      ))}
    </div>
  ) : null
}

export default SearchResults
