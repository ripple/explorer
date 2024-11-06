import { useContext, useState } from 'react'
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
  const { data: XRPUSDPrice = 0.0 } = useQuery(
    ['fetchXRPToUSDRate'],
    () => fetchXRPToUSDRate(),
    {
      refetchInterval: FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
    },
  )

  const { data: tokens = [] } = useQuery(
    ['fetchTokens', currentSearchValue],
    () => fetchTokens(),
    {
      enabled: !!currentSearchValue,
      staleTime: 0,
      keepPreviousData: false,
      onError: (error) => Log.error(error),
    },
  )

  const fetchXRPToUSDRate = async () => {
    try {
      const accountLines = await getAccountLines(
        rippledSocket,
        ORACLE_ACCOUNT,
        1,
      )
      return accountLines.lines[0]?.limit ?? 0.0 // Return the fetched XRP/USD price or 0.0 if not available
    } catch (e) {
      Log.error(e)
      return 0.0
    }
  }

  const fetchTokens = async () => {
    if (currentSearchValue === '') {
      return [] // Return an empty list if search is cleared
    }

    const response = await axios.get(
      `/api/v1/tokens/search/${currentSearchValue}`,
    )
    return response.data.tokens
  }

  const onLinkClick = () => {
    analytics.track('token_search_click', {
      search_category: 'token',
      search_term: currentSearchValue,
    })

    // clear current search on navigation
    setCurrentSearchInput('')
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
