import { useContext } from 'react'
import './styles.scss'

import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useAnalytics } from '../../analytics'
import { TokenSearchRow } from './TokenSearchRow'
import { MPTSearchRow } from './MPTSearchRow'
import SocketContext from '../../SocketContext'
import Log from '../../log'
import { getAccountLines } from '../../../../rippled/lib/rippled'
import {
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  ORACLE_ACCOUNT,
} from '../../utils'
import { LOSToken } from '../../losTypes'

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
      onError: (error) => {
        Log.error(error)
        return 0.0
      },
    },
  )

  const { data: tokens = [] } = useQuery<LOSToken[]>(
    ['fetchTokens', currentSearchValue],
    () => fetchTokens(),
    {
      enabled: !!currentSearchValue,
      staleTime: 0,
      keepPreviousData: false,
      onError: (error) => Log.error(error),
    },
  )

  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )

  const fetchTokens = () => {
    if (currentSearchValue === '') {
      return [] // Return an empty list if search is cleared
    }

    return axios
      .get(`/api/v1/tokens/search/${currentSearchValue}`)
      .then((response) => response.data.tokens)
  }

  const onLinkClick = (searchCategory: 'token' | 'mpt') => () => {
    analytics.track('token_search_click', {
      search_category: searchCategory,
      search_term: currentSearchValue,
    })

    // clear current search on navigation
    setCurrentSearchInput('')
  }

  const byHoldersDesc = (a: LOSToken, b: LOSToken) =>
    (b.holders ?? 0) - (a.holders ?? 0)

  const iouTokens = tokens
    .filter((token) => token.token_type !== 'MPT')
    .sort(byHoldersDesc)
  const mptTokens = tokens
    .filter((token) => token.token_type === 'MPT')
    .sort(byHoldersDesc)

  if (tokens.length === 0) {
    return null
  }

  return (
    <div className="search-results-menu">
      {iouTokens.length > 0 && (
        <>
          <div className="search-results-header">
            {t('tokens')} ({iouTokens.length})
          </div>

          {iouTokens.map((token) => (
            <TokenSearchRow
              token={token}
              onClick={onLinkClick('token')}
              xrpPrice={XRPUSDPrice}
              key={`${token.currency}.${token.issuer_account}`}
            />
          ))}
        </>
      )}

      {mptTokens.length > 0 && (
        <>
          <div className="search-results-header">
            {t('mpts')} ({mptTokens.length})
          </div>

          {mptTokens.map((token) => (
            <MPTSearchRow
              token={token}
              onClick={onLinkClick('mpt')}
              xrpPrice={XRPUSDPrice}
              key={token.mpt_issuance_id ?? token.currency}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default SearchResults
