import axios from 'axios'
import { useQuery } from 'react-query'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { Loader } from '../shared/components/Loader'
import Log from '../shared/log'
import { parseCurrencyAmount, TokensTable } from './TokensTable'
import {
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  ORACLE_ACCOUNT,
} from '../shared/utils'
import { getAccountLines } from '../../rippled/lib/rippled'
import SocketContext from '../shared/SocketContext'
// import tokensData from './mockTokens.json'
import './tokens.scss'
import { Pagination } from '../shared/components/Pagination'
import { Loader } from '../shared/components/Loader'
import { LOSToken } from '../shared/losTypes'

interface FilterProps {
  categories: CategoryKey[]
  filterField: string
  setFilterField: (field: string) => void
}

interface TokensData {
  tokens: LOSToken[]
  metrics: {
    count: string
    market_cap: string
    volume_24h: string
  }
}

type CategoryKey = 'rwa' | 'stablecoin' | 'wrapped' | 'memes'

const PAGE_SIZE = 15
const Filter: FC<FilterProps> = ({
  categories,
  filterField,
  setFilterField,
}) => {
  const { t } = useTranslation()

  const handleClick = (cat) => {
    if (filterField === cat) {
      setFilterField('')
    } else {
      setFilterField(cat)
    }
  }

  return (
    <div className="filter">
      <div className="filter-icon" />
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-field ${cat === filterField ? 'selected' : ''}`}
          onClick={() => handleClick(cat)}
          type="button"
        >
          <div className={`item-icon icon-${cat}`} />
          <div className="filter-label">{t(cat)}</div>
        </button>
      ))}
    </div>
  )
}

export const Tokens = () => {
  const rippledSocket = useContext(SocketContext)
  const [sortField, setSortField] = useState('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterField, setFilterField] = useState('')
  const [page, setPage] = useState(1)

  const { t } = useTranslation()
  const filterCategories: CategoryKey[] = [
    'rwa',
    'stablecoin',
    'wrapped',
    'memes',
  ]

  const { data: tokensData } = useQuery<TokensData>(
    ['fetchTokens'],
    () => fetchTokens(),
    {
      refetchInterval: 60 * 1000,
      onError: (error) => Log.error(error),
    },
  )
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

  const filteredTokens = useMemo(() => {
    if (!tokensData || !tokensData.tokens) return []

    if (filterField === '') {
      return tokensData.tokens
    }

    return tokensData.tokens.filter(
      (token) =>
        token.asset_class === filterField ||
        token.asset_subclass === filterField,
    )
  }, [tokensData, filterField])

  const getSortValue = (token, field) => {
    switch (field) {
      case 'price':
        return Number(token.price ?? 0)
      case 'holders':
        return Number(token.holders) ?? 0
      case 'market_cap':
      case 'marketcap':
        return Number(token.market_cap ?? 0)
      case '24h':
        return token.price_change ?? 0
      case 'volume':
        return Number(token.daily_volume ?? 0)
      case 'trades':
        return Number(token.daily_trades) ?? 0
      case 'issuer':
        return token.issuer_account.toLowerCase() ?? ''
      default:
        return 0
    }
  }

  const sortTokens = useCallback(
    (tokens: LOSToken[]) =>
      [...tokens].sort((a, b) => {
        const aVal = getSortValue(a, sortField)
        const bVal = getSortValue(b, sortField)
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      }),
    [sortField, sortOrder],
  )

  const sortedTokens = useMemo(
    () => sortTokens(filteredTokens),
    [filteredTokens, sortTokens],
  )

  const fetchTokens = () =>
    axios.get('/api/v1/tokens').then((response) => ({
      tokens: response.data.tokens,
      metrics: response.data.metrics,
    }))
  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )
  const start = (page - 1) * PAGE_SIZE

  const pagedTokens = sortedTokens
    .slice(start, start + PAGE_SIZE)
    .map((token, idx) => ({
      ...token,
      index: start + idx + 1,
    }))
  return (
    <div className="tokens-page">
      <div className="type">{t('tokens')}</div>
      {tokensData?.metrics && (
        <div className="metrics-wrapper">
          <div className="metric">
            <div className="title">{t('no_of_tokens')}</div>
            <div className="val">{tokensData.metrics.count}</div>
          </div>
          <div className="metric">
            <div className="title">{t('market_cap')}</div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.market_cap, XRPUSDPrice)}
            </div>
          </div>
          <div className="metric">
            <div className="title">{t('volume_24h_total')}</div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.volume_24h, XRPUSDPrice)}
            </div>
          </div>
        </div>
      )}
      <Filter
        categories={filterCategories}
        filterField={filterField}
        setFilterField={setFilterField}
      />
      {pagedTokens.length > 0 ? (
        <>
          <TokensTable
            tokens={pagedTokens}
            xrpPrice={XRPUSDPrice}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <Pagination
            totalItems={sortedTokens.length}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
