import axios from 'axios'
import { useQuery } from 'react-query'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Log from '../shared/log'
import { parseCurrencyAmount, TokensTable } from './TokensTable'
import {
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  ORACLE_ACCOUNT,
} from '../shared/utils'
import { getAccountLines } from '../../rippled/lib/rippled'
import SocketContext from '../shared/SocketContext'
import './tokens.scss'
import { Pagination } from '../shared/components/Pagination'
import { Loader } from '../shared/components/Loader'
import { LOSToken } from '../shared/losTypes'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import HoverIcon from '../shared/images/hover.svg'

interface FilterProps {
  categories: CategoryKey[]
  filterField: string
  setFilterField: (field: string) => void
  setPage: (page: number) => void
}

interface TokensData {
  tokens: LOSToken[]
  metrics: {
    count: number
    market_cap: string
    volume_24h: string
    rwa: string
    stablecoin: string
  }
}

type CategoryKey = 'rwa' | 'stablecoin' | 'wrapped'

const TOOLTIP_Y_OFFSET = 80

const PAGE_SIZE = 15
const Filter: FC<FilterProps> = ({
  categories,
  filterField,
  setFilterField,
  setPage,
}) => {
  const { t } = useTranslation()

  const handleClick = (cat) => {
    if (filterField === cat) {
      setFilterField('')
    } else {
      setFilterField(cat)
    }
    setPage(1)
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
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const { t } = useTranslation()

  const filterCategories: CategoryKey[] = ['rwa', 'stablecoin', 'wrapped']

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

  const renderTextTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

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
      case 'tvl':
        return token.tvl_xrp ?? 0
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
      <Tooltip tooltip={tooltip} />
      <div className="type">{t('tokens')}</div>
      {tokensData?.metrics && (
        <div className="metrics-wrapper">
          <div className="metric">
            <div className="title">{t('no_of_tokens')}</div>
            <div className="val">{tokensData.metrics.count}</div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('market_cap')}</span>
              {renderTextTooltip('market_cap')}
            </div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.market_cap, XRPUSDPrice)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('volume_24h_total')}</span>
              {renderTextTooltip('volume_24h_total')}
            </div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.volume_24h, XRPUSDPrice)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('rwa')}</span>
              {renderTextTooltip('rwa')}
            </div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.rwa, XRPUSDPrice)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('stablecoin')}</span>
              {renderTextTooltip('stablecoin')}
            </div>
            <div className="val">
              {parseCurrencyAmount(tokensData.metrics.stablecoin, XRPUSDPrice)}
            </div>
          </div>
        </div>
      )}
      {pagedTokens.length > 0 ? (
        <>
          <Filter
            categories={filterCategories}
            filterField={filterField}
            setFilterField={setFilterField}
            setPage={setPage}
          />
          <TokensTable
            tokens={pagedTokens}
            xrpPrice={XRPUSDPrice}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setPage={setPage}
          />
          <div className="footnote">
            <Trans
              i18nKey="tokens_footnote"
              components={{
                Link: <Link to="https://xrplmeta.org">XRPLMeta</Link>,
              }}
            />
          </div>
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
