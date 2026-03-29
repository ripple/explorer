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
import { paginationService as transfersPaginationService } from '../shared/services/transfersPagination'
import { useCursorPaginatedQuery } from '../../shared/hooks/useCursorPaginatedQuery'
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

  // Transfers — using shared hook
  const transfers = useCursorPaginatedQuery({
    service: transfersPaginationService,
    id: mptIssuanceId,
    pageSize: PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
    enabled: !!mptIssuanceId,
  })

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
            transfersData={transfers.data?.items || []}
            transfersPagination={{
              currentPage: transfers.page,
              setCurrentPage: transfers.setPage,
              pageSize: PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
              total: transfers.data?.totalItems || 0,
              hasMore: transfers.data?.hasMore || false,
              hasPrevPage: transfers.page > 1,
            }}
            transfersSorting={{
              sortField: transfers.sortField,
              setSortField: transfers.setSortField,
              sortOrder: transfers.sortOrder,
              setSortOrder: transfers.setSortOrder,
            }}
            transfersLoading={transfers.isLoading}
            onRefreshTransfers={transfers.refresh}
          />
        </div>
      )}
    </Page>
  )
}
