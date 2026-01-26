import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import SocketContext from '../../shared/SocketContext'
import { getMPTHolders } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Loader } from '../../shared/components/Loader'
import { DepositorTable } from './DepositorTable'
import './styles.scss'

interface Props {
  shareMptId: string
  totalSupply: string | undefined
  assetsTotal: string | undefined
}

export const VaultDepositors = ({
  shareMptId,
  totalSupply,
  assetsTotal,
}: Props) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const [currentPage, setCurrentPage] = useState(0)
  const [markers, setMarkers] = useState<(string | undefined)[]>([undefined])

  const pageSize = 5

  const {
    data,
    isFetching: loading,
    error,
  } = useQuery<any, Error>(
    ['getVaultDepositors', shareMptId, currentPage],
    async () => {
      const marker = markers[currentPage]
      const resp = await getMPTHolders(
        rippledSocket,
        shareMptId,
        pageSize,
        marker || '',
      )
      return resp
    },
    {
      enabled: !!shareMptId,
      keepPreviousData: true,
      onSuccess: (resp) => {
        // Store marker for next page if it exists and we haven't stored it yet
        if (resp?.marker && markers.length === currentPage + 1) {
          setMarkers((prev) => [...prev, resp.marker])
        }
      },
      onError: (e: any) => {
        trackException(
          `Error fetching Vault depositors ${shareMptId} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

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

  if (!data && !loading) {
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

  const holders = data?.mpt_holders || []
  const hasNextPage = !!data?.marker
  const hasPrevPage = currentPage > 0

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  if (loading && holders.length === 0) {
    return (
      <div className="vault-depositors-section">
        <h2 className="vault-depositors-title">{t('depositors')}</h2>
        <div className="vault-depositors-divider" />
        <Loader />
      </div>
    )
  }

  // TODO: Test this method with a working instance of Clio.
  if (!holders || holders.length === 0) {
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

  return (
    <div className="vault-depositors-section">
      <h2 className="vault-depositors-title">{t('depositors')}</h2>
      <div className="vault-depositors-divider" />
      <DepositorTable
        holders={holders}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        startRank={currentPage * pageSize + 1}
      />
      <div className="pagination">
        <button
          type="button"
          className="pagination-btn"
          onClick={handlePrevPage}
          disabled={!hasPrevPage}
        >
          &lt;
        </button>
        <span className="pagination-info">{currentPage + 1}</span>
        <button
          type="button"
          className="pagination-btn"
          onClick={handleNextPage}
          disabled={!hasNextPage}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
