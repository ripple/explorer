import { FC, useState, useMemo, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AMMPool } from './api'
import Currency, { hexToString } from '../shared/components/Currency'
import { Account } from '../shared/components/Account'
import { CurrencySwitch } from '../shared/components/CurrencySwitch'
import {
  parseAmount,
  parseCurrencyAmount,
  parsePercent,
  parseIntegerAmount,
} from '../shared/NumberFormattingUtils'
import { shortenAccount, formatTradingFee } from '../shared/utils'
import { useTooltip } from '../shared/components/Tooltip'
import HoverIcon from '../shared/images/hover.svg'
import xrpIconSvg from '../shared/images/xrp_icon.svg?url'
import DefaultTokenIcon from '../shared/images/default_token_icon.svg'
import { Pagination } from '../shared/components/Pagination'

interface AMMRankingsTableProps {
  amms: AMMPool[]
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

const TokenIcon: FC<{
  currency: string
  iconUrl?: string
}> = ({ currency, iconUrl }) => {
  // Safety check for currency
  if (!currency) {
    return <DefaultTokenIcon className="token-icon fallback" />
  }

  // Fallback content (default token icon)
  const fallbackContent = <DefaultTokenIcon className="token-icon fallback" />

  // Icon content (image or fallback)
  const iconContent = iconUrl ? (
    <img
      src={iconUrl}
      alt={`${currency} logo`}
      className="token-icon"
      onError={(e) => {
        // If image fails to load, replace with fallback
        e.currentTarget.style.display = 'none'
        e.currentTarget.parentElement?.classList.add('fallback-mode')
      }}
    />
  ) : (
    fallbackContent
  )

  return (
    <div className="token-icon-wrapper">
      {iconContent}
      {iconUrl && (
        <DefaultTokenIcon
          className="token-icon fallback"
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
}

const PoolDisplay: FC<{ amm: AMMPool }> = ({ amm }) => (
  <div className="pool-display">
    <div className="token-pair">
      <TokenIcon currency={amm.currency_1} iconUrl={amm.icon_1} />
      <TokenIcon currency={amm.currency_2} iconUrl={amm.icon_2} />
    </div>
    <div className="pool-name">
      <Currency
        currency={amm.currency_1}
        issuer={amm.issuer_1}
        displaySymbol={false}
        hideIssuer
      />
      /
      <Currency
        currency={amm.currency_2}
        issuer={amm.issuer_2}
        displaySymbol={false}
        hideIssuer
      />
    </div>
  </div>
)

export const AMMRankingsTable: FC<AMMRankingsTableProps> = ({
  amms,
  currencyMode,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()
  const [filterField, setFilterField] = useState<CategoryFilter | ''>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [tableCurrency, setTableCurrency] = useState<'usd' | 'xrp'>(
    currencyMode,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)
  const pageSize = 15

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const renderTooltip = (key: string, yOffset = 60) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_tooltip` as any), {
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
      result = result.filter(
        (amm) =>
          amm.asset_class_1 === filterField ||
          amm.asset_class_2 === filterField ||
          amm.asset_subclass_1 === filterField ||
          amm.asset_subclass_2 === filterField,
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const decodeCurrency = (code: string): string => {
        if (code.length === 40 && !code.startsWith('03')) {
          return hexToString(code)
        }
        return code
      }
      result = result.filter((amm) => {
        const currency1 = (amm.currency_1 || '').toLowerCase()
        const currency2 = (amm.currency_2 || '').toLowerCase()
        const decoded1 = decodeCurrency(amm.currency_1 || '').toLowerCase()
        const decoded2 = decodeCurrency(amm.currency_2 || '').toLowerCase()
        const accountId = (amm.amm_account_id || '').toLowerCase()
        return (
          currency1.includes(q) ||
          currency2.includes(q) ||
          decoded1.includes(q) ||
          decoded2.includes(q) ||
          accountId.includes(q)
        )
      })
    }

    return result
  }, [amms, filterField, searchQuery])

  // Paginate the filtered results
  const paginatedAmms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAmms.slice(startIndex, startIndex + pageSize)
  }, [filteredAmms, currentPage, pageSize])

  // Enrich paginated AMMs with XRP icon (local SVG) for XRP currencies
  // Non-XRP token icons come from the server cache (icon_1, icon_2 fields)
  const enrichedPaginatedAmms = useMemo(
    () =>
      paginatedAmms.map((amm) => ({
        ...amm,
        icon_1: amm.currency_1 === 'XRP' ? xrpIconSvg : amm.icon_1,
        icon_2: amm.currency_2 === 'XRP' ? xrpIconSvg : amm.icon_2,
      })),
    [paginatedAmms],
  )

  const getTVL = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.tvl_usd : amm.tvl_xrp

  const getVolume = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.trading_volume_usd : amm.trading_volume_xrp

  const getFees24h = (amm: AMMPool) =>
    tableCurrency === 'usd' ? amm.fees_collected_usd : amm.fees_collected_xrp

  const formatCurrencyAmount = (value: number): string => {
    if (tableCurrency === 'xrp') {
      return `${parseAmount(value)} XRP`
    }
    return parseCurrencyAmount(value)
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
      <td className="trading-fee">
        {amm.trading_fee != null
          ? `${formatTradingFee(amm.trading_fee)}%`
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="volume">
        {getVolume(amm) != null
          ? formatCurrencyAmount(getVolume(amm))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="fees-24h">
        {getFees24h(amm) != null
          ? formatCurrencyAmount(getFees24h(amm))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="apr">
        {amm.annual_percentage_return != null
          ? parsePercent(amm.annual_percentage_return, 3, 0.001)
          : DEFAULT_EMPTY_VALUE}
      </td>
    </tr>
  )

  return (
    <div className="amm-rankings-table-container" ref={tableRef}>
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
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            className="amm-search"
            placeholder={t('search_amms')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page when search changes
            }}
          />
        </div>

        <CurrencySwitch
          leftLabel="USD"
          rightLabel="XRP"
          selected={tableCurrency === 'usd' ? 'USD' : 'XRP'}
          onChange={(value) =>
            setTableCurrency(value === 'USD' ? 'usd' : 'xrp')
          }
        />
      </div>

      <div className="table-wrap">
        <table className="basic amm-rankings-table">
          <thead>
            <tr>
              <th className="rank">#</th>
              <th className="pool">{t('asset_pair')}</th>
              <th className="amm-account-id">{t('amm_account_id')}</th>
              <th className="tvl">{t('tvl')}</th>
              <th className="lp-count">{t('number_of_lps')}</th>
              <th className="trading-fee">{t('trading_fee')}</th>
              <th className="volume has-tooltip">
                <span className="sort-header">
                  {t('volume_24h')}
                  {renderTooltip('volume_24h')}
                </span>
              </th>
              <th className="fees-24h has-tooltip">
                <span className="sort-header">
                  {t('fees_24h')}
                  {renderTooltip('fees_24h')}
                </span>
              </th>
              <th className="apr has-tooltip">
                <span className="sort-header">
                  {t('apr_24h')}
                  {renderTooltip('apr_24h')}
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
        onPageChange={handlePageChange}
        pageSize={pageSize}
        scrollToTop={null}
        showLastPage
      />
    </div>
  )
}
