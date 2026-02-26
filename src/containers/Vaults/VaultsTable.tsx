import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Loader } from '../shared/components/Loader'
import SortTableColumn from '../shared/components/SortColumn'
import { RouteLink } from '../shared/routing'
import { VAULT_ROUTE } from '../App/routes'
import {
  parseCurrencyAmount,
  parsePercent,
} from '../shared/NumberFormattingUtils'
import { Vault } from './index'
import ExternalLinkIcon from '../shared/images/external_link.svg'

type SortOrder = 'asc' | 'desc'

interface VaultWithIndex extends Vault {
  index: number
}

interface VaultsTableProps {
  vaults: VaultWithIndex[]
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
}

const DEFAULT_EMPTY_VALUE = '--'

const VaultLogo: FC<{ icon: string | undefined }> = ({ icon }) =>
  icon ? (
    <object data={icon} className="icon">
      <div className="icon" />
    </object>
  ) : (
    <div className="icon no-logo" />
  )

export const VaultsTable = ({
  vaults,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setPage,
}: VaultsTableProps) => {
  const { t } = useTranslation()

  const renderVault = (vault: VaultWithIndex) => (
    <tr key={vault.id}>
      <td className="count">{vault.index}</td>
      <td className="name">
        <VaultLogo icon={vault.icon} />
        <RouteLink
          to={VAULT_ROUTE}
          params={{ id: vault.id }}
          className="text-truncate"
        >
          {vault.name}
        </RouteLink>
      </td>
      <td className="vault-id text-truncate">
        <RouteLink
          to={VAULT_ROUTE}
          params={{ id: vault.id }}
          className="text-truncate"
        >
          {vault.id.length > 12
            ? `${vault.id.slice(0, 6)}...${vault.id.slice(-6)}`
            : vault.id}
        </RouteLink>
      </td>
      <td className="asset">{vault.asset}</td>
      <td className="website">
        {vault.website ? (
          <a
            href={vault.website}
            target="_blank"
            rel="noopener noreferrer"
            className="website-link"
          >
            <ExternalLinkIcon className="external-icon" />
          </a>
        ) : (
          DEFAULT_EMPTY_VALUE
        )}
      </td>
      <td className="tvl">
        {vault.tvl_usd && Number(vault.tvl_usd) !== 0
          ? parseCurrencyAmount(vault.tvl_usd)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="outstanding-loans">
        {vault.outstanding_loans_usd && Number(vault.outstanding_loans_usd) !== 0
          ? parseCurrencyAmount(vault.outstanding_loans_usd)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="avg-interest-rate">
        {vault.avg_interest_rate != null
          ? parsePercent(vault.avg_interest_rate)
          : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="utilization-ratio">
        {vault.utilization_ratio != null
          ? parsePercent(vault.utilization_ratio)
          : DEFAULT_EMPTY_VALUE}
      </td>
    </tr>
  )

  return vaults.length > 0 ? (
    <div className="vaults-table">
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="count">#</th>
              <th className="name-col">{t('name')}</th>
              <th className="vault-id-col">{t('vaults_id')}</th>
              <th className="asset-col">{t('asset')}</th>
              <th className="website-col">{t('website')}</th>
              <SortTableColumn
                field="tvl"
                label={t('tvl')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="outstanding_loans"
                label={t('vaults_outstanding_loans_short')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="avg_interest_rate"
                label={t('vaults_avg_interest_rate_short')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
              <SortTableColumn
                field="utilization_ratio"
                label={t('vaults_utilization_ratio_short')}
                sortField={sortField}
                setSortField={setSortField}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setPage={setPage}
                tooltip
              />
            </tr>
          </thead>
          <tbody>{vaults.map(renderVault)}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

