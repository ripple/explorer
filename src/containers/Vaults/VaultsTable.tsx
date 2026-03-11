import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import SortTableColumn from '../shared/components/SortColumn'
import { VaultData } from './index'
import { parseCurrencyAmount, parsePercent } from '../shared/NumberFormattingUtils'
import { shortenAccount } from '../shared/utils'
import ExternalLink from '../shared/images/external_link.svg'

type SortOrder = 'asc' | 'desc'

interface VaultsTableProps {
  vaults: (VaultData & { index: number })[]
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
}

const DEFAULT_EMPTY_VALUE = '--'

const formatAssetDisplay = (vault: VaultData): string => {
  if (vault.asset_currency === 'XRP') return 'XRP'
  const issuerDisplay = vault.asset_issuer_name
    ? vault.asset_issuer_name
    : shortenAccount(vault.asset_issuer)
  return `${vault.asset_currency} (${issuerDisplay})`
}

export const VaultsTable = ({
  vaults,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setPage,
}: VaultsTableProps) => {
  const { t } = useTranslation()

  const renderVaultRow = (vault: VaultData & { index: number }) => (
    <tr key={vault.vault_id}>
      <td className="rank">{vault.index}</td>
      <td className="vault-id text-truncate">
        <span className="green-link">{shortenAccount(vault.vault_id)}</span>
      </td>
      <td className="name text-truncate">{vault.name}</td>
      <td className="asset text-truncate">
        <span className={vault.asset_currency === 'XRP' ? 'green-link' : 'green-link'}>
          {formatAssetDisplay(vault)}
        </span>
      </td>
      <td className="tvl right">
        {vault.tvl_usd ? parseCurrencyAmount(vault.tvl_usd) : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="outstanding-loans right">
        {vault.outstanding_loans_usd != null
          ? parseCurrencyAmount(vault.outstanding_loans_usd)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="utilization right">
        {vault.utilization_ratio != null
          ? parsePercent(vault.utilization_ratio)
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
            href={vault.website}
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

  return vaults.length > 0 ? (
    <div className="vaults-table">
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="rank">#</th>
              <th className="vault-id">{t('vaults_table_vault_id')}</th>
              <th className="name-col">{t('name')}</th>
              <th className="asset">{t('vaults_table_asset')}</th>
              <SortTableColumn
                field="tvl_usd"
                label={t('vaults_table_tvl')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <SortTableColumn
                field="outstanding_loans_usd"
                label={t('vaults_table_outstanding_loans')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <SortTableColumn
                field="utilization_ratio"
                label={t('vaults_table_utilization_ratio')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <SortTableColumn
                field="avg_interest_rate"
                label={t('vaults_table_avg_interest_rate')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
              />
              <th className="website">{t('vaults_table_website')}</th>
            </tr>
          </thead>
          <tbody>{vaults.map(renderVaultRow)}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader />
  )
}
