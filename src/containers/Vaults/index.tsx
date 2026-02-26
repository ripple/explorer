import { FC, useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { VaultsTable } from './VaultsTable'
import {
  parseCurrencyAmount,
  parsePercent,
  parseIntegerAmount,
} from '../shared/NumberFormattingUtils'
import './vaults.scss'
import { Pagination } from '../shared/components/Pagination'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import HoverIcon from '../shared/images/hover.svg'
import { useAnalytics } from '../shared/analytics'

interface FilterProps {
  categories: CategoryKey[]
  filterField: string
  setFilterField: (field: string) => void
  setPage: (page: number) => void
}

export interface Vault {
  id: string
  name: string
  asset: string
  asset_type: string
  website?: string
  tvl: number
  tvl_usd: number
  outstanding_loans: number
  outstanding_loans_usd: number
  avg_interest_rate: number
  utilization_ratio: number
  icon?: string
}

interface VaultsAggStats {
  tvl: string
  outstanding_loans: string
  loans_originated: string
  avg_interest_rate: number
  num_vaults: number
  utilization_ratio: number
}

interface VaultsData {
  vaults: Vault[]
  total: number
}

type CategoryKey = 'all' | 'xrp' | 'stablecoin'

const TOOLTIP_Y_OFFSET = 80
const PAGE_SIZE = 15

const Filter: FC<FilterProps> = ({
  categories,
  filterField,
  setFilterField,
  setPage,
}) => {
  const { t } = useTranslation()

  const handleClick = (cat: string) => {
    if (filterField === cat) {
      setFilterField('all')
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
          <div className="filter-label">{t(`vaults_filter_${cat}`)}</div>
        </button>
      ))}
    </div>
  )
}

export const Vaults = () => {
  const [sortField, setSortField] = useState('tvl')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterField, setFilterField] = useState<string>('all')
  const [page, setPage] = useState(1)
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const { t } = useTranslation()
  const { trackScreenLoaded } = useAnalytics()

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  const filterCategories: CategoryKey[] = ['all', 'xrp', 'stablecoin']

  // Mock data for development
  const aggStats: VaultsAggStats = {
    tvl: '125000000',
    outstanding_loans: '87500000',
    loans_originated: '250000000',
    avg_interest_rate: 0.0825,
    num_vaults: 42,
    utilization_ratio: 0.7,
  }

  const mockVaults: Vault[] = [
    {
      id: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
      name: 'XRP Prime Vault',
      asset: 'XRP',
      asset_type: 'xrp',
      website: 'https://example.com/xrp-prime',
      tvl: 25000000,
      tvl_usd: 25000000,
      outstanding_loans: 18750000,
      outstanding_loans_usd: 18750000,
      avg_interest_rate: 0.075,
      utilization_ratio: 0.75,
    },
    {
      id: 'B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7',
      name: 'USDC Stable Vault',
      asset: 'USDC',
      asset_type: 'stablecoin',
      website: 'https://example.com/usdc-vault',
      tvl: 50000000,
      tvl_usd: 50000000,
      outstanding_loans: 35000000,
      outstanding_loans_usd: 35000000,
      avg_interest_rate: 0.065,
      utilization_ratio: 0.7,
    },
    {
      id: 'C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8',
      name: 'XRP Yield Vault',
      asset: 'XRP',
      asset_type: 'xrp',
      website: 'https://example.com/xrp-yield',
      tvl: 15000000,
      tvl_usd: 15000000,
      outstanding_loans: 12000000,
      outstanding_loans_usd: 12000000,
      avg_interest_rate: 0.085,
      utilization_ratio: 0.8,
    },
    {
      id: 'D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9',
      name: 'USDT Reserve Vault',
      asset: 'USDT',
      asset_type: 'stablecoin',
      website: 'https://example.com/usdt-reserve',
      tvl: 20000000,
      tvl_usd: 20000000,
      outstanding_loans: 14000000,
      outstanding_loans_usd: 14000000,
      avg_interest_rate: 0.055,
      utilization_ratio: 0.7,
    },
    {
      id: 'E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
      name: 'XRP Growth Fund',
      asset: 'XRP',
      asset_type: 'xrp',
      tvl: 8000000,
      tvl_usd: 8000000,
      outstanding_loans: 5600000,
      outstanding_loans_usd: 5600000,
      avg_interest_rate: 0.095,
      utilization_ratio: 0.7,
    },
    {
      id: 'F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1',
      name: 'RLUSD Vault',
      asset: 'RLUSD',
      asset_type: 'stablecoin',
      website: 'https://example.com/rlusd',
      tvl: 7000000,
      tvl_usd: 7000000,
      outstanding_loans: 2100000,
      outstanding_loans_usd: 2100000,
      avg_interest_rate: 0.045,
      utilization_ratio: 0.3,
    },
  ]

  const vaultsData: VaultsData = {
    vaults: mockVaults,
    total: mockVaults.length,
  }

  const filteredVaults = useMemo(() => {
    if (!vaultsData || !vaultsData.vaults) return []
    if (filterField === 'all') return vaultsData.vaults
    return vaultsData.vaults.filter((vault) => vault.asset_type === filterField)
  }, [vaultsData, filterField])

  const renderTextTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const getSortValue = (vault: Vault, field: string) => {
    switch (field) {
      case 'tvl':
        return vault.tvl_usd ?? 0
      case 'outstanding_loans':
        return vault.outstanding_loans_usd ?? 0
      case 'avg_interest_rate':
        return vault.avg_interest_rate ?? 0
      case 'utilization_ratio':
        return vault.utilization_ratio ?? 0
      default:
        return 0
    }
  }

  const sortVaults = useCallback(
    (vaults: Vault[]) =>
      [...vaults].sort((a, b) => {
        const aVal = getSortValue(a, sortField)
        const bVal = getSortValue(b, sortField)
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      }),
    [sortField, sortOrder],
  )

  const sortedVaults = useMemo(
    () => sortVaults(filteredVaults),
    [filteredVaults, sortVaults],
  )

  const start = (page - 1) * PAGE_SIZE
  const pagedVaults = sortedVaults
    .slice(start, start + PAGE_SIZE)
    .map((vault, idx) => ({
      ...vault,
      index: start + idx + 1,
    }))

  return (
    <div className="vaults-page">
      <Tooltip tooltip={tooltip} />
      <div className="type">{t('vaults')}</div>
      {aggStats && (
        <div className="metrics-wrapper">
          <div className="metric">
            <div className="title">
              <span>{t('vaults_tvl')}</span>
              {renderTextTooltip('vaults_tvl')}
            </div>
            <div className="val">{parseCurrencyAmount(aggStats.tvl)}</div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_outstanding_loans')}</span>
              {renderTextTooltip('vaults_outstanding_loans')}
            </div>
            <div className="val">
              {parseCurrencyAmount(aggStats.outstanding_loans)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_loans_originated')}</span>
              {renderTextTooltip('vaults_loans_originated')}
            </div>
            <div className="val">
              {parseCurrencyAmount(aggStats.loans_originated)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_avg_interest_rate')}</span>
              {renderTextTooltip('vaults_avg_interest_rate')}
            </div>
            <div className="val">
              {parsePercent(aggStats.avg_interest_rate)}
            </div>
          </div>
          <div className="metric">
            <div className="title">{t('vaults_num_vaults')}</div>
            <div className="val">{parseIntegerAmount(aggStats.num_vaults)}</div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_utilization_ratio')}</span>
              {renderTextTooltip('vaults_utilization_ratio')}
            </div>
            <div className="val">
              {parsePercent(aggStats.utilization_ratio)}
            </div>
          </div>
        </div>
      )}
      {pagedVaults.length > 0 ? (
        <>
          <Filter
            categories={filterCategories}
            filterField={filterField}
            setFilterField={setFilterField}
            setPage={setPage}
          />
          <VaultsTable
            vaults={pagedVaults}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setPage={setPage}
          />
          <Pagination
            totalItems={sortedVaults.length}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="no-vaults">{t('no_vaults_found')}</div>
      )}
    </div>
  )
}
