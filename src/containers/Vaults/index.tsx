import { useEffect, useMemo, useState } from 'react'
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

export interface VaultData {
  vault_id: string
  name: string
  asset_currency: string
  asset_issuer: string
  asset_issuer_name: string
  tvl_usd: number
  outstanding_loans_usd: number
  utilization_ratio: number
  avg_interest_rate: number
  website: string
  asset_category: string
}

interface VaultsMetrics {
  total_value_locked: number
  outstanding_loans: number
  loans_originated: number
  avg_interest_rate: number
  num_vaults: number
  utilization_ratio: number
}

interface VaultsData {
  vaults: VaultData[]
  metrics: VaultsMetrics
}

type FilterCategory = '' | 'xrp' | 'stablecoin'

const TOOLTIP_Y_OFFSET = 80
const PAGE_SIZE = 10

// TODO: Replace with actual API call
const fetchVaultsData = (): Promise<VaultsData> =>
  Promise.resolve({
    metrics: {
      total_value_locked: 205500000,
      outstanding_loans: 50500000,
      loans_originated: 400500000,
      avg_interest_rate: 10.2,
      num_vaults: 20,
      utilization_ratio: 60.5,
    },
    vaults: [
      {
        vault_id: '4A3B2C1D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0BCDEF1',
        name: 'Maple Infrastructure II',
        asset_currency: 'RLUSD',
        asset_issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
        asset_issuer_name: '',
        tvl_usd: 20500000,
        outstanding_loans_usd: 20500000,
        utilization_ratio: 80.5,
        avg_interest_rate: 12.5,
        website: 'https://maple.finance',
        asset_category: 'stablecoin',
      },
      {
        vault_id: '8B76543210FEDCBA9876543210FEDCBA9876543EDCBA',
        name: 'Clearpool Prime XRP',
        asset_currency: 'XRP',
        asset_issuer: '',
        asset_issuer_name: '',
        tvl_usd: 45200000,
        outstanding_loans_usd: 12100000,
        utilization_ratio: 26.8,
        avg_interest_rate: 4.2,
        website: 'https://clearpool.finance',
        asset_category: 'xrp',
      },
      {
        vault_id: 'E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E90E1F2',
        name: 'TrueFi USD Credit',
        asset_currency: 'USD',
        asset_issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        asset_issuer_name: 'Bitstamp',
        tvl_usd: 12900000,
        outstanding_loans_usd: 11500000,
        utilization_ratio: 89.8,
        avg_interest_rate: 10.8,
        website: 'https://truefi.io',
        asset_category: 'stablecoin',
      },
      {
        vault_id: '1122334455667788990011223344556677889900EFF00',
        name: 'Orthogonal Trading',
        asset_currency: 'RLUSD',
        asset_issuer: 'rBR1GNsdh9XyPqg5XRj2x4PoJ12n5RaPjj',
        asset_issuer_name: 'Ripple',
        tvl_usd: 100500000,
        outstanding_loans_usd: 95400000,
        utilization_ratio: 94.9,
        avg_interest_rate: 14.2,
        website: 'https://orthogonal.trading',
        asset_category: 'stablecoin',
      },
      {
        vault_id: 'F0E1D2C3B4A5968778695A4B3C2D1E0F1A2B3CB9C8D',
        name: 'WBTC Merchant Liquidity',
        asset_currency: 'BTC',
        asset_issuer: 'rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL',
        asset_issuer_name: 'GateHub',
        tvl_usd: 8200000,
        outstanding_loans_usd: 3100000,
        utilization_ratio: 37.8,
        avg_interest_rate: 6.5,
        website: 'https://gatehub.net',
        asset_category: '',
      },
      {
        vault_id: '55AA66BB77CC88DD99EE00FF11223344556677C00DD',
        name: 'Institutional Treasury A',
        asset_currency: 'RLUSD',
        asset_issuer: 'rBR1GNsdh9XyPqg5XRj2x4PoJ12n5RaPjj',
        asset_issuer_name: 'Ripple',
        tvl_usd: 250000000,
        outstanding_loans_usd: 0,
        utilization_ratio: 0.0,
        avg_interest_rate: 0.0,
        website: '',
        asset_category: 'stablecoin',
      },
      {
        vault_id: '1234567890ABCDEF1234567890ABCDEF12345BCDEF',
        name: 'Solo Gen Market',
        asset_currency: 'SOLO',
        asset_issuer: 'rsoLo2S1kiGeCcn6hCUXVrCpGMWFasRf8s',
        asset_issuer_name: 'Sologenic',
        tvl_usd: 1500000,
        outstanding_loans_usd: 1200000,
        utilization_ratio: 80.0,
        avg_interest_rate: 18.5,
        website: 'https://sologenic.com',
        asset_category: '',
      },
      {
        vault_id: 'CF23B10D4E5F6A7B8C9D0E1F2A3B4C5D6E7F80AB12',
        name: 'XRPL DeFi Growth Fund',
        asset_currency: 'XRP',
        asset_issuer: '',
        asset_issuer_name: '',
        tvl_usd: 55400000,
        outstanding_loans_usd: 48200000,
        utilization_ratio: 87.0,
        avg_interest_rate: 9.1,
        website: 'https://xrpldefi.fund',
        asset_category: 'xrp',
      },
      {
        vault_id: '8899AABB00112233445566778899AABBCCDDE56677',
        name: 'Euro Real Estate',
        asset_currency: 'EUR',
        asset_issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        asset_issuer_name: 'GateHub',
        tvl_usd: 4200000,
        outstanding_loans_usd: 3900000,
        utilization_ratio: 92.9,
        avg_interest_rate: 7.8,
        website: 'https://eurorealestate.io',
        asset_category: '',
      },
      {
        vault_id: '7ABB9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5F7A88',
        name: 'Gaming Guild Loans',
        asset_currency: 'MAG',
        asset_issuer: 'rMPTa7x9876543210ABCDEF1234567890AB',
        asset_issuer_name: '',
        tvl_usd: 650000,
        outstanding_loans_usd: 200000,
        utilization_ratio: 30.8,
        avg_interest_rate: 22.0,
        website: 'https://gamingguild.io',
        asset_category: '',
      },
    ],
  })

export const Vaults = () => {
  const [sortField, setSortField] = useState('tvl_usd')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterField, setFilterField] = useState<FilterCategory>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()

  const [vaultsData, setVaultsData] = useState<VaultsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  useEffect(() => {
    fetchVaultsData()
      .then((data) => {
        setVaultsData(data)
        setLoading(false)
      })
      .catch((error) => {
        Log.error(error)
        trackException(`vaults fetch --- ${JSON.stringify(error)}`)
        setLoading(false)
      })
  }, [trackException])

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

  // TODO: Replace with API-driven filtering
  const filteredVaults = useMemo(() => {
    if (!vaultsData?.vaults) return []
    return vaultsData.vaults
  }, [vaultsData])

  const sortedVaults = useMemo(() => {
    const sorted = [...filteredVaults].sort((a, b) => {
      const aVal = a[sortField] ?? 0
      const bVal = b[sortField] ?? 0
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredVaults, sortField, sortOrder])

  const start = (page - 1) * PAGE_SIZE
  const pagedVaults = sortedVaults
    .slice(start, start + PAGE_SIZE)
    .map((vault, idx) => ({
      ...vault,
      index: start + idx + 1,
    }))

  const filterCategories: { key: FilterCategory; label: string }[] = [
    { key: '', label: t('vaults_filter_all_assets') },
    { key: 'xrp', label: 'XRP' },
    { key: 'stablecoin', label: t('vaults_filter_stablecoins') },
  ]

  const handleFilterClick = (cat: FilterCategory) => {
    setFilterField(cat === filterField ? '' : cat)
    setPage(1)
  }

  return (
    <div className="vaults-page">
      <Helmet title={t('vaults')} />
      <Tooltip tooltip={tooltip} />
      <div className="type">{t('vaults')}</div>
      {vaultsData?.metrics && (
        <div className="metrics-wrapper">
          <div className="metric">
            <div className="title">
              <span>{t('vaults_tvl')}</span>
              {renderTextTooltip('vaults_tvl')}
            </div>
            <div className="val">
              {parseCurrencyAmount(vaultsData.metrics.total_value_locked)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_outstanding_loans')}</span>
              {renderTextTooltip('vaults_outstanding_loans')}
            </div>
            <div className="val">
              {parseCurrencyAmount(vaultsData.metrics.outstanding_loans)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_loans_originated')}</span>
              {renderTextTooltip('vaults_loans_originated')}
            </div>
            <div className="val">
              {parseCurrencyAmount(vaultsData.metrics.loans_originated)}
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_avg_interest_rate')}</span>
              {renderTextTooltip('vaults_avg_interest_rate')}
            </div>
            <div className="val">
              {vaultsData.metrics.avg_interest_rate.toFixed(1)}%
            </div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_num_vaults')}</span>
              {renderTextTooltip('vaults_num_vaults')}
            </div>
            <div className="val">{vaultsData.metrics.num_vaults}</div>
          </div>
          <div className="metric">
            <div className="title">
              <span>{t('vaults_utilization_ratio')}</span>
              {renderTextTooltip('vaults_utilization_ratio')}
            </div>
            <div className="val">
              {vaultsData.metrics.utilization_ratio.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <>
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
          <VaultsTable
            vaults={pagedVaults}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setPage={setPage}
          />
          <div className="footnote">{t('vaults_disclaimer')}</div>
          <Pagination
            totalItems={sortedVaults.length}
            currentPage={page}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  )
}
