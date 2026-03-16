import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import { RouteLink } from '../shared/routing'
import { TOKEN_ROUTE } from '../App/routes'
import type { VaultData } from './types'
import {
  parseCurrencyAmount,
  parsePercent,
} from '../shared/NumberFormattingUtils'
import { shortenAccount } from '../shared/utils'
import ExternalLink from '../shared/images/external_link.svg'
import ArrowIcon from '../shared/images/down_arrow.svg'

type SortOrder = 'asc' | 'desc'

interface VaultsTableProps {
  vaults: (VaultData & { index: number })[]
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
  xrpToUSDRate: number
}

const DEFAULT_EMPTY_VALUE = '--'

const shortenVaultIdShort = (id: string): string =>
  id.length > 10 ? `${id.slice(0, 5)}...${id.slice(-3)}` : id

const formatAssetDisplay = (vault: VaultData): string => {
  if (vault.asset_currency === 'XRP') return 'XRP'
  const issuerDisplay = vault.asset_issuer_name
    ? vault.asset_issuer_name
    : shortenAccount(vault.asset_issuer)
  return `${vault.asset_currency} (${issuerDisplay})`
}

const toUsd = (vault: VaultData, amount: number, xrpToUSDRate: number): number =>
  vault.asset_currency === 'XRP' ? amount * xrpToUSDRate : amount

export const VaultsTable = ({
  vaults,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setPage,
  xrpToUSDRate,
}: VaultsTableProps) => {
  const { t } = useTranslation()

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const renderSortHeader = (field: string, label: string) => {
    const isActive = sortField === field
    return (
      <th
        className={`${field} sortable ${isActive ? 'active' : ''}`}
        onClick={() => handleSort(field)}
      >
        <span className="sort-header">
          {label}
          <ArrowIcon
            className={`arrow ${isActive && sortOrder === 'asc' ? 'asc' : 'desc'}`}
          />
        </span>
      </th>
    )
  }

  const renderVaultRow = (vault: VaultData & { index: number }) => (
    <tr key={vault.vault_id}>
      <td className="rank">{vault.index}</td>
      <td className="vault-id">
        <a href={`/vault/${vault.vault_id}`} className="green-link vault-id-long">
          {shortenAccount(vault.vault_id)}
        </a>
        <a href={`/vault/${vault.vault_id}`} className="green-link vault-id-short">
          {shortenVaultIdShort(vault.vault_id)}
        </a>
      </td>
      <td className="name text-truncate">{vault.name}</td>
      <td className="asset text-truncate">
        {vault.asset_currency !== 'XRP' && vault.asset_issuer ? (
          <RouteLink
            to={TOKEN_ROUTE}
            params={{
              token: `${vault.asset_currency}.${vault.asset_issuer}`,
            }}
            className="green-link"
          >
            {formatAssetDisplay(vault)}
          </RouteLink>
        ) : (
          <span>{formatAssetDisplay(vault)}</span>
        )}
      </td>
      <td className="tvl right">
        {vault.tvl_usd
          ? parseCurrencyAmount(toUsd(vault, vault.tvl_usd, xrpToUSDRate))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="outstanding-loans right">
        {vault.outstanding_loans_usd != null
          ? parseCurrencyAmount(toUsd(vault, vault.outstanding_loans_usd, xrpToUSDRate))
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="utilization right">
        {vault.utilization_ratio != null
          ? parsePercent(vault.utilization_ratio * 100)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="interest-rate right">
        {vault.avg_interest_rate != null
          ? parsePercent(vault.avg_interest_rate)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="website">
        {vault.website ? (
          <a
            href={vault.website.match(/^https?:\/\//) ? vault.website : `https://${vault.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="website-link"
          >
            <ExternalLink className="external-link-icon" />
          </a>
        ) : (
          DEFAULT_EMPTY_VALUE
        )}
      </td>
    </tr>
  )

  return (
    <div className="vaults-table">
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="rank">#</th>
              <th className="vault-id">{t('vaults_table_vault_id')}</th>
              <th className="name-col">{t('name')}</th>
              <th className="asset">{t('vaults_table_asset')}</th>
              {renderSortHeader('tvl_usd', t('vaults_table_tvl'))}
              {renderSortHeader(
                'outstanding_loans_usd',
                t('vaults_table_outstanding_loans'),
              )}
              {renderSortHeader(
                'utilization_ratio',
                t('vaults_table_utilization_ratio'),
              )}
              {renderSortHeader(
                'avg_interest_rate',
                t('vaults_table_avg_interest_rate'),
              )}
              <th className="website">{t('vaults_table_website')}</th>
            </tr>
          </thead>
          <tbody>
            {vaults.length > 0 ? (
              vaults.map(renderVaultRow)
            ) : (
              <tr>
                <td colSpan={9} className="empty-message">
                  {t('vaults_no_results')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
