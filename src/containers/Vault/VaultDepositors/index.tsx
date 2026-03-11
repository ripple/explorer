import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import SocketContext from '../../shared/SocketContext'
import { useAnalytics } from '../../shared/analytics'
import { Loader } from '../../shared/components/Loader'
import { HoldersTable } from '../../Token/shared/components/HoldersTable/HoldersTable'
import { useTokenToUSDRate } from '../../shared/hooks/useTokenToUSDRate'
import { fetchAllVaultDepositors } from './api/depositors'
import './styles.scss'

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  shareMptId: string
  totalSupply: string | undefined
  assetsTotal: string | undefined
  asset?: AssetInfo
}

const PAGE_SIZE = 10

export const VaultDepositors = ({
  shareMptId,
  totalSupply,
  assetsTotal,
  asset,
}: Props) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const [currentPage, setCurrentPage] = useState(1)

  const { rate: tokenToUsdRate } = useTokenToUSDRate(asset)

  const {
    data,
    isFetching: loading,
    error,
  } = useQuery(
    [
      'getVaultDepositors',
      shareMptId,
      totalSupply,
      assetsTotal,
      tokenToUsdRate,
    ],
    async () =>
      fetchAllVaultDepositors(
        rippledSocket,
        shareMptId,
        totalSupply,
        assetsTotal,
        tokenToUsdRate,
      ),
    {
      enabled: !!shareMptId,
      onError: (e: any) => {
        trackException(
          `Error fetching Vault depositors ${shareMptId} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  // Client-side pagination
  const paginatedDepositors = useMemo(() => {
    if (!data?.depositors) {
      return []
    }

    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return data.depositors.slice(start, end)
  }, [data?.depositors, currentPage])

  if (error) {
    return (
      <div className="vault-depositors-section">
        <h2 className="vault-depositors-title">{t('depositors')}</h2>
        <div className="vault-depositors-divider" />
        <div className="depositors-error-message">
          {t('depositors_fetch_error')}
        </div>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="vault-depositors-section">
        <h2 className="vault-depositors-title">{t('depositors')}</h2>
        <div className="vault-depositors-divider" />
        <Loader />
      </div>
    )
  }

  if (!data || data.depositors.length === 0) {
    return (
      <div className="vault-depositors-section">
        <h2 className="vault-depositors-title">{t('depositors')}</h2>
        <div className="vault-depositors-divider" />
        <div className="no-depositors-message">
          {t('no_depositors_message')}
        </div>
      </div>
    )
  }

  // TODO: Test the visual appearance of this table after Clio API mpt_holders is implemented
  return (
    <div className="vault-depositors-section">
      <h2 className="vault-depositors-title">{t('depositors')}</h2>
      <div className="vault-depositors-divider" />
      <HoldersTable
        holders={paginatedDepositors}
        isHoldersDataLoading={loading}
        totalHolders={data.totalDepositors}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
