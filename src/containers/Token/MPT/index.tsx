import {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { useRouteParams } from '../../shared/routing'
import { MPT_ROUTE } from '../../App/routes'
import { Header } from './Header'
import { TablePicker } from './TablePicker'
import NoMatch from '../../NoMatch'

import './styles.scss'
import '../shared/styles.scss'
import { NOT_FOUND, BAD_REQUEST, shortenMPTID } from '../../shared/utils'
import { useAnalytics } from '../../shared/analytics'
import { ErrorMessages, FormattedMPTIssuance } from '../../shared/Interfaces'
import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { getMPTIssuance } from '../../../rippled/lib/rippled'
import { formatMPTIssuance } from '../../../rippled/lib/utils'
import { fetchAllMPTHolders } from './api/holders'
import { transfersPaginationService } from '../shared/services/transfersPagination'
import { PAGINATION_CONFIG, INITIAL_PAGE } from '../shared/constants'

const ERROR_MESSAGES: ErrorMessages = {
  default: {
    title: 'generic_error',
    hints: ['not_your_fault'],
  },
  [NOT_FOUND]: {
    title: 'assets.no_mpts_message',
    hints: ['check_mpt_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_xrpl_address',
    hints: ['check_mpt_id'],
  },
}

const getErrorMessage = (error: unknown) =>
  ERROR_MESSAGES[error as string | number] || ERROR_MESSAGES.default

const Page: FC<PropsWithChildren<{ mptIssuanceId: string }>> = ({
  mptIssuanceId,
  children,
}) => (
  <div className="token-page">
    <Helmet title={`MPT ${shortenMPTID(mptIssuanceId)}`} />
    {children}
  </div>
)

export const MPT = () => {
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { id: mptIssuanceId = '' } = useRouteParams(MPT_ROUTE)
  const [error, setError] = useState<number | null>(null)
  const rippledSocket = useContext(SocketContext)

  // Holders pagination state
  const [holdersPage, setHoldersPage] = useState(INITIAL_PAGE)
  const holdersPageSize = PAGINATION_CONFIG.HOLDERS_PAGE_SIZE

  // Transfers pagination state
  const [transfersPage, setTransfersPage] = useState(INITIAL_PAGE)
  const transfersPageSize = PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE
  const [transfersSortField, setTransfersSortField] = useState('timestamp')
  const [transfersSortOrder, setTransfersSortOrder] = useState<'asc' | 'desc'>(
    'desc',
  )
  const [transfersRefreshCount, setTransfersRefreshCount] = useState(0)

  // Transfers data state
  const [transfersData, setTransfersData] = useState<{
    transfers: any[]
    totalTransfers: number
    isLoading: boolean
    hasMore: boolean
    hasPrevPage: boolean
  }>({
    transfers: [],
    totalTransfers: 0,
    isLoading: true,
    hasMore: false,
    hasPrevPage: false,
  })

  // Fetch MPT issuance data
  const { data: mptokenIssuance, isFetching: mptLoading } =
    useQuery<FormattedMPTIssuance>(
      ['getMPTIssuance', mptIssuanceId],
      async () => {
        const info = await getMPTIssuance(rippledSocket, mptIssuanceId)
        return formatMPTIssuance(info.node)
      },
      {
        enabled: !!mptIssuanceId,
        onError: (e: any) => {
          trackException(
            `mptIssuance ${mptIssuanceId} --- ${JSON.stringify(e)}`,
          )
          setError(e.code || NOT_FOUND)
        },
      },
    )

  // Fetch ALL holders data at once using mpt_holders Clio method
  const { data: holdersData, isFetching: holdersLoading } = useQuery(
    ['getMPTHolders', mptIssuanceId],
    async () =>
      fetchAllMPTHolders(
        rippledSocket,
        mptIssuanceId,
        mptokenIssuance?.outstandingAmt || '0',
        mptokenIssuance?.assetScale ?? 0,
      ),
    {
      enabled: !!mptokenIssuance?.issuer,
    },
  )

  // Client-side pagination: slice the holders array for the current page
  const paginatedHolders = useMemo(() => {
    if (!holdersData?.holders) {
      return []
    }

    const start = (holdersPage - 1) * holdersPageSize
    const end = start + holdersPageSize
    return holdersData.holders.slice(start, end)
  }, [holdersData?.holders, holdersPage, holdersPageSize])

  // Handle sort changes for transfers - reset to page 1, clear cache, and set loading state
  useEffect(() => {
    setTransfersPage(INITIAL_PAGE)
    setTransfersData((prev) => ({ ...prev, isLoading: true }))
    transfersPaginationService.clearCache(
      mptIssuanceId,
      transfersSortField,
      transfersSortOrder,
    )
  }, [transfersSortField, transfersSortOrder, mptIssuanceId])

  // Fetch transfers with pagination service
  useEffect(() => {
    const fetchTransfers = async () => {
      if (!mptIssuanceId) {
        return
      }

      try {
        const result = await transfersPaginationService.getTransfersPage(
          mptIssuanceId,
          transfersPage,
          PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
          transfersSortField,
          transfersSortOrder,
        )

        setTransfersData({
          transfers: result.transfers,
          totalTransfers: result.totalTransfers,
          isLoading: result.isLoading,
          hasMore: result.hasMore,
          hasPrevPage: transfersPage > 1,
        })
      } catch (err) {
        trackException(`transfers ${mptIssuanceId} --- ${JSON.stringify(err)}`)
        setTransfersData({
          transfers: [],
          totalTransfers: 0,
          isLoading: false,
          hasMore: false,
          hasPrevPage: transfersPage > 1,
        })
      }
    }

    fetchTransfers()
  }, [
    mptIssuanceId,
    transfersPage,
    transfersSortField,
    transfersSortOrder,
    transfersRefreshCount,
    trackException,
  ])

  // Refresh handler for transfers
  const handleRefreshTransfers = () => {
    setTransfersPage(INITIAL_PAGE)
    setTransfersData((prev) => ({ ...prev, isLoading: true }))
    transfersPaginationService.clearCache(
      mptIssuanceId,
      transfersSortField,
      transfersSortOrder,
    )
    setTransfersRefreshCount((prev) => prev + 1)
  }

  // Track page view
  useEffect(() => {
    trackScreenLoaded({
      mpt_issuance_id: mptIssuanceId,
    })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [mptIssuanceId, trackScreenLoaded])

  const renderError = () => {
    const message = getErrorMessage(error)
    return (
      <div className="token-page">
        <NoMatch title={message.title} hints={message.hints} />
      </div>
    )
  }

  if (error) {
    return <Page mptIssuanceId={mptIssuanceId}>{renderError()}</Page>
  }

  return (
    <Page mptIssuanceId={mptIssuanceId}>
      {mptLoading ? (
        <Loader />
      ) : (
        mptokenIssuance && (
          <Header
            mptIssuanceId={mptIssuanceId}
            data={mptokenIssuance}
            loading={mptLoading}
            setError={setError}
            holdersCount={holdersData?.totalHolders}
            holdersLoading={holdersLoading}
          />
        )
      )}

      {mptIssuanceId && mptokenIssuance && (
        <div className="section">
          <TablePicker
            mptIssuanceId={mptIssuanceId}
            issuer={mptokenIssuance.issuer}
            assetScale={mptokenIssuance.assetScale}
            holdersData={paginatedHolders}
            holdersPagination={{
              currentPage: holdersPage,
              setCurrentPage: setHoldersPage,
              pageSize: holdersPageSize,
              total: holdersData?.totalHolders || 0,
            }}
            holdersLoading={holdersLoading}
            transfersData={transfersData.transfers}
            transfersPagination={{
              currentPage: transfersPage,
              setCurrentPage: setTransfersPage,
              pageSize: transfersPageSize,
              total: transfersData.totalTransfers,
              hasMore: transfersData.hasMore,
              hasPrevPage: transfersData.hasPrevPage,
            }}
            transfersSorting={{
              sortField: transfersSortField,
              setSortField: setTransfersSortField,
              sortOrder: transfersSortOrder,
              setSortOrder: setTransfersSortOrder,
            }}
            transfersLoading={transfersData.isLoading}
            onRefreshTransfers={handleRefreshTransfers}
          />
        </div>
      )}
    </Page>
  )
}
