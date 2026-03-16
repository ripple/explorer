import { FC, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AMMPool, fetchIconsForAMMs } from './api'
import SortTableColumn from '../shared/components/SortColumn'
import Currency from '../shared/components/Currency'
import { Account } from '../shared/components/Account'
import {
  parseCurrencyAmount,
  parsePercent,
  parseIntegerAmount,
} from '../shared/NumberFormattingUtils'
import { shortenAccount } from '../shared/utils'
import { useTooltip } from '../shared/components/Tooltip'
import HoverIcon from '../shared/images/hover.svg'
import xrpIconSvg from '../shared/images/xrp_icon.svg?url'
import { Pagination } from '../shared/components/Pagination'
import { RouteLink } from '../shared/routing'
import { TOKEN_ROUTE } from '../App/routes'

interface AMMRankingsTableProps {
  amms: AMMPool[]
  sortField: string
  setSortField: (field: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  currencyMode: 'usd' | 'xrp'
}

type CategoryFilter = 'rwa' | 'stablecoin' | 'memes' | 'defi'

const DEFAULT_EMPTY_VALUE = '--'

const CATEGORIES: CategoryFilter[] = ['rwa', 'stablecoin', 'memes', 'defi']

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  rwa: 'RWA',
  stablecoin: 'Stablecoins',
  memes: 'Memes',
  defi: 'DeFi',
}

const TokenIcon: FC<{ currency: string; issuer?: string; iconUrl?: string }> = ({
  currency,
  issuer,
  iconUrl
}) => {
  // Safety check for currency
  if (!currency) {
    return <div className="token-icon fallback">??</div>
  }

  // Fallback content (text-based icon)
  const fallbackContent = (
    <div className="token-icon fallback">
      {currency.substring(0, 2).toUpperCase()}
    </div>
  )

  // Icon content (image or fallback)
  const iconContent = iconUrl ? (
    <img
      src={iconUrl}
      alt={`${currency} logo`}
      className="token-icon"
      onError={(e) => {
        // If image fails to load, replace with fallback
        console.error(`Failed to load icon for ${currency}:`, iconUrl)
        e.currentTarget.style.display = 'none'
        e.currentTarget.parentElement?.classList.add('fallback-mode')
      }}
    />
  ) : fallbackContent

  // Only tokens with issuers are clickable (not XRP)
  if (!issuer) {
    return (
      <div className="token-icon-wrapper">
        {iconContent}
        {iconUrl && <div className="token-icon fallback" style={{ display: 'none' }}>{currency.substring(0, 2).toUpperCase()}</div>}
      </div>
    )
  }

  return (
    <RouteLink
      to={TOKEN_ROUTE}
      params={{ token: `${currency}.${issuer}` }}
      className="token-icon-link"
    >
      <div className="token-icon-wrapper">
        {iconContent}
        {iconUrl && <div className="token-icon fallback" style={{ display: 'none' }}>{currency.substring(0, 2).toUpperCase()}</div>}
      </div>
    </RouteLink>
  )
}

const PoolDisplay: FC<{ amm: AMMPool }> = ({ amm }) => {
  return (
    <div className="pool-display">
      <div className="token-pair">
        <TokenIcon
          currency={amm.currency_1}
          issuer={amm.issuer_1}
          iconUrl={amm.icon_1}
        />
        <TokenIcon
          currency={amm.currency_2}
          issuer={amm.issuer_2}
          iconUrl={amm.icon_2}
        />
      </div>
      <div className="pool-name">
        {amm.currency_1 === 'XRP' ? (
          'XRP'
        ) : (
          <Currency currency={amm.currency_1} link={false} />
        )}
        {'/'}
        {amm.currency_2 === 'XRP' ? (
          'XRP'
        ) : (
          <Currency currency={amm.currency_2} link={false} />
        )}
      </div>
    </div>
  )
}

export const AMMRankingsTable: FC<AMMRankingsTableProps> = ({
  amms,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  currencyMode,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()
  const [filterField, setFilterField] = useState<CategoryFilter | ''>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [tableCurrency, setTableCurrency] = useState<'usd' | 'xrp'>(currencyMode)
  const [currentPage, setCurrentPage] = useState(1)
  const [iconMap, setIconMap] = useState<Record<string, string>>({})
  const [loadingIcons, setLoadingIcons] = useState(false)
  const pageSize = 10

  const renderTooltip = (key: string, yOffset = 60) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_tooltip`), {
          x: rect.left + rect.width / 2,
          y: rect.top - yOffset,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const handleFilterClick = (cat: CategoryFilter) => {
    setFilterField(filterField === cat ? '' : cat)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const filteredAmms = useMemo(() => {
    let result = amms

    if (filterField) {
      result = result.filter((amm) =>
        amm.asset_class === filterField ||
        amm.asset_class_1 === filterField ||
        amm.asset_class_2 === filterField
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (amm) => {
          const currency1 = (amm.currency_1 || '').toLowerCase()
          const currency2 = (amm.currency_2 || '').toLowerCase()
          const accountId = (amm.amm_account_id || '').toLowerCase()
          return currency1.includes(q) || currency2.includes(q) || accountId.includes(q)
        }
      )
    }

    return result
  }, [amms, filterField, searchQuery])

  // Paginate the filtered results
  const paginatedAmms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAmms.slice(startIndex, startIndex + pageSize)
  }, [filteredAmms, currentPage, pageSize])

  // Fetch icons for the current page when page changes
  useEffect(() => {
    const loadIconsForCurrentPage = async () => {
      setLoadingIcons(true)
      try {
        const icons = await fetchIconsForAMMs(paginatedAmms)
        setIconMap((prevMap) => ({ ...prevMap, ...icons }))
      } catch (error) {
        console.error('Failed to fetch icons for current page:', error)
      } finally {
        setLoadingIcons(false)
      }
    }

    if (paginatedAmms.length > 0) {
      loadIconsForCurrentPage()
    }
  }, [paginatedAmms])

  // Enrich paginated AMMs with icons from the icon map
  const enrichedPaginatedAmms = useMemo(() => {
    // Use imported SVG for XRP icon (Vite will handle the path)
    const XRP_ICON_URL = xrpIconSvg

    const enriched = paginatedAmms.map((amm) => {
      const icon_1 = amm.currency_1 === 'XRP'
        ? XRP_ICON_URL
        : (amm.currency_1 && amm.issuer_1
          ? iconMap[`${amm.currency_1}.${amm.issuer_1}`]
          : undefined)

      const icon_2 = amm.currency_2 === 'XRP'
        ? XRP_ICON_URL
        : (amm.currency_2 && amm.issuer_2
          ? iconMap[`${amm.currency_2}.${amm.issuer_2}`]
          : undefined)

      if (amm.currency_1 === 'XRP' || amm.currency_2 === 'XRP') {
        console.log('XRP AMM:', amm.amm_account_id, 'icon_1:', icon_1, 'icon_2:', icon_2)
      }

      return {
        ...amm,
        icon_1,
        icon_2,
      }
    })

    return enriched
  }, [paginatedAmms, iconMap])

  const getTVL = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.tvl_usd : amm.tvl_xrp

  const getVolume = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.trading_volume_usd : amm.trading_volume_xrp

  const getFees24h = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.fees_collected_usd : amm.fees_collected_xrp

  // Format currency amounts with $ prefix for USD or XRP suffix for XRP
  // Uses K/M/B abbreviations for values >= 1000
  const formatCurrencyAmount = (value: number): string => {
    const suffix = tableCurrency === 'xrp' ? ' XRP' : ''

    if (value >= 1000000000) {
      const formatted = tableCurrency === 'usd'
        ? `$${(value / 1000000000).toFixed(2)}B`
        : `${(value / 1000000000).toFixed(2)}B${suffix}`
      return formatted
    }
    if (value >= 1000000) {
      const formatted = tableCurrency === 'usd'
        ? `$${(value / 1000000).toFixed(2)}M`
        : `${(value / 1000000).toFixed(2)}M${suffix}`
      return formatted
    }
    if (value >= 1000) {
      const formatted = tableCurrency === 'usd'
        ? `$${(value / 1000).toFixed(2)}K`
        : `${(value / 1000).toFixed(2)}K${suffix}`
      return formatted
    }

    // For values < 1000, use standard formatting
    const formatted = parseCurrencyAmount(value.toString())
    if (tableCurrency === 'xrp') {
      return `${formatted.replace('$', '')} XRP`
    }
    return formatted
  }

  // Format fees with K/M/B abbreviations for all values >= 1000
  const formatFeesCompact = (value: number): string => {
    const suffix = tableCurrency === 'xrp' ? ' XRP' : ''
    if (value >= 1000000) {
      const formatted = tableCurrency === 'usd'
        ? `$${(value / 1000000).toFixed(1)}M`
        : `${(value / 1000000).toFixed(1)}M${suffix}`
      return formatted
    }
    if (value >= 1000) {
      const formatted = tableCurrency === 'usd'
        ? `$${(value / 1000).toFixed(1)}K`
        : `${(value / 1000).toFixed(1)}K${suffix}`
      return formatted
    }
    const formatted = tableCurrency === 'usd'
      ? `$${value.toFixed(2)}`
      : `${value.toFixed(2)}${suffix}`
    return formatted
  }

  const renderAMM = (amm: AMMPool, index: number) => (
    <tr key={amm.amm_account_id}>
      <td className="rank">{index + 1}</td>
      <td className="pool">
        <PoolDisplay amm={amm} />
      </td>
      <td className="amm-account-id">
        <Account
          account={amm.amm_account_id}
          displayText={shortenAccount(amm.amm_account_id)}
        />
      </td>
      <td className="tvl">
        {getTVL(amm) != null
          ? formatCurrencyAmount(getTVL(amm))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="lp-count">
        {amm.liquidity_provider_count != null
          ? parseIntegerAmount(amm.liquidity_provider_count.toString())
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="volume">
        {getVolume(amm) != null
          ? formatCurrencyAmount(getVolume(amm))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="fees-24h">
        {getFees24h(amm) != null
          ? formatFeesCompact(getFees24h(amm))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="apr">
        {amm.annual_percentage_return != null
          ? parsePercent(amm.annual_percentage_return)
          : DEFAULT_EMPTY_VALUE}
      </td>
    </tr>
  )

  return (
    <div className="amm-rankings-table-container">
      <h2 className="table-title">{t('top_1000_amms')}</h2>

      <div className="table-controls">
        <div className="table-filters">
          <div className="filter-icon-btn" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-filter ${cat === filterField ? 'selected' : ''}`}
              onClick={() => handleFilterClick(cat)}
            >
              <div className={`item-icon icon-${cat}`} />
              <span>{CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
          <div className="search-wrapper">
            <input
              type="text"
              className="amm-search"
              placeholder="Search AMMs"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page when search changes
              }}
            />
          </div>
        </div>

        <div className="table-currency-toggle">
          <span
            className={tableCurrency === 'usd' ? 'currency-label active' : 'currency-label'}
          >
            USD
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={tableCurrency === 'xrp'}
              onChange={() =>
                setTableCurrency(tableCurrency === 'usd' ? 'xrp' : 'usd')
              }
            />
            <span className="toggle-slider" />
          </label>
          <span
            className={tableCurrency === 'xrp' ? 'currency-label active' : 'currency-label'}
          >
            XRP
          </span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="basic amm-rankings-table">
          <thead>
            <tr>
              <th className="rank">#</th>
              <th className="pool">{t('pair')}</th>
              <th className="amm-account-id">{t('amm_account_id')}</th>
              <th className="tvl has-tooltip">
                <span className="sort-header">
                  {t('tvl')}
                  {renderTooltip('tvl')}
                </span>
              </th>
              <th className="lp-count"># OF LPS</th>
              <th className="volume has-tooltip">
                <span className="sort-header">
                  {t('volume_24h')}
                  {renderTooltip('volume_24h')}
                </span>
              </th>
              <th className="fees-24h">FEES (24H)</th>
              <th className="apr has-tooltip">
                <span className="sort-header">
                  APR (24H)
                  {renderTooltip('apr')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {enrichedPaginatedAmms.map((amm, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index
              return renderAMM(amm, globalIndex)
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredAmms.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        scrollToTop={0}
        showLastPage={false}
      />
    </div>
  )
}
