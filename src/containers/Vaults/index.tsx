import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import Log from '../shared/log'
import { VaultsTable } from './VaultsTable'
import { parseCurrencyAmount } from '../shared/NumberFormattingUtils'
import './vaults.scss'
import { Pagination } from '../shared/components/Pagination'
import { Loader } from '../shared/components/Loader'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import HoverIcon from '../shared/images/hover.svg'
import { useAnalytics } from '../shared/analytics'
import type { VaultData } from './types'
import { fetchVaultsList, fetchVaultsAggregateStats } from './api'
import type { VaultsMetrics, VaultsListResponse } from './api'

export type { VaultData }

type FilterCategory = '' | 'xrp' | 'stablecoin'

const TOOLTIP_Y_OFFSET = 80
const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400

export const Vaults = () => {
  const [sortField, setSortField] = useState('tvl_usd')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterField, setFilterField] = useState<FilterCategory>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()

  const [metrics, setMetrics] = useState<VaultsMetrics | null>(null)
  const [vaultsResponse, setVaultsResponse] =
    useState<VaultsListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [metricsLoading, setMetricsLoading] = useState(true)

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  // Fetch aggregate stats once on mount
  useEffect(() => {
    fetchVaultsAggregateStats()
      .then((data) => {
        setMetrics(data)
        setMetricsLoading(false)
      })
      .catch((error) => {
        Log.error(error)
        trackException(`vaults stats fetch --- ${JSON.stringify(error)}`)
        setMetricsLoading(false)
      })
  }, [trackException])

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [searchQuery])

  // Fetch vaults list whenever params change
  const fetchVaults = useCallback(() => {
    setLoading(true)
    fetchVaultsList({
      page,
      size: PAGE_SIZE,
      sortField,
      sortOrder,
      assetType: filterField,
      searchQuery: debouncedSearch,
    })
      .then((data) => {
        setVaultsResponse(data)
        setLoading(false)
      })
      .catch((error) => {
        Log.error(error)
        trackException(`vaults list fetch --- ${JSON.stringify(error)}`)
        setLoading(false)
      })
  }, [page, sortField, sortOrder, filterField, debouncedSearch, trackException])

  useEffect(() => {
    fetchVaults()
  }, [fetchVaults])

  const renderTextTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const vaults = (vaultsResponse?.results ?? []).map((vault, idx) => ({
    ...vault,
    index: (page - 1) * PAGE_SIZE + idx + 1,
  }))

  const totalItems = vaultsResponse?.total ?? 0

  const filterCategories: {
    key: FilterCategory
    label: string
  }[] = [
    { key: '', label: t('vaults_filter_all_assets') },
    { key: 'xrp', label: 'XRP' },
    {
      key: 'stablecoin',
      label: t('vaults_filter_stablecoins'),
    },
  ]

  const handleFilterClick = (cat: FilterCategory) => {
    setFilterField(cat === filterField ? '' : cat)
    setPage(1)
  }

  const handleSortFieldChange = (field: string) => {
    setSortField(field)
    setPage(1)
  }

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order)
    setPage(1)
  }

  return (
    <div className="vaults-page">
      <Helmet title={t('vaults')} />
      <Tooltip tooltip={tooltip} />
      <div className="type">{t('vaults')}</div>
      {metricsLoading ? (
        <Loader />
      ) : (
        metrics && (
          <div className="metrics-wrapper">
            <div className="metric">
              <div className="title">
                <span>{t('vaults_tvl')}</span>
                {renderTextTooltip('vaults_tvl')}
              </div>
              <div className="val">
                {parseCurrencyAmount(metrics.tvl_total)}
              </div>
            </div>
            <div className="metric">
              <div className="title">
                <span>{t('vaults_outstanding_loans')}</span>
                {renderTextTooltip('vaults_outstanding_loans')}
              </div>
              <div className="val">
                {parseCurrencyAmount(metrics.debt_total)}
              </div>
            </div>
            <div className="metric">
              <div className="title">
                <span>{t('vaults_loans_originated')}</span>
                {renderTextTooltip('vaults_loans_originated')}
              </div>
              <div className="val">
                {parseCurrencyAmount(metrics.loans_originated)}
              </div>
            </div>
            <div className="metric">
              <div className="title">
                <span>{t('vaults_avg_interest_rate')}</span>
                {renderTextTooltip('vaults_avg_interest_rate')}
              </div>
              <div className="val">{metrics.avg_interest_rate.toFixed(1)}%</div>
            </div>
            <div className="metric">
              <div className="title">
                <span>{t('vaults_num_vaults')}</span>
                {renderTextTooltip('vaults_num_vaults')}
              </div>
              <div className="val">{metrics.active_vaults}</div>
            </div>
            <div className="metric">
              <div className="title">
                <span>{t('vaults_utilization_ratio')}</span>
                {renderTextTooltip('vaults_utilization_ratio')}
              </div>
              <div className="val">{metrics.utilization_ratio.toFixed(1)}%</div>
            </div>
          </div>
        )
      )}
      <div className="vaults-controls">
        <div className="filter">
          <div className="filter-icon" />
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              className={`filter-field ${cat.key === filterField ? 'selected' : ''}`}
              onClick={() => handleFilterClick(cat.key)}
              type="button"
            >
              <div className="filter-label">{cat.label}</div>
            </button>
          ))}
        </div>
        <div className="search-bar">
          <div className="search-icon" />
          <input
            type="text"
            placeholder={t('vaults_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <VaultsTable
            vaults={vaults}
            sortField={sortField}
            setSortField={handleSortFieldChange}
            sortOrder={sortOrder}
            setSortOrder={handleSortOrderChange}
            setPage={setPage}
          />
          <div className="footnote">{t('vaults_disclaimer')}</div>
          <Pagination
            totalItems={totalItems}
            currentPage={page}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  )
}
