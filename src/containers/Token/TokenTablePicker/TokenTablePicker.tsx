import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { Tabs } from '../../shared/components/Tabs'
import { getAccountTransactions } from '../../../rippled'
import {
  DexTradeTable,
  LOSDEXTransaction,
} from '../components/DexTradeTable/DexTradeTable'
import {
  HoldersTable,
  XRPLHolder,
} from '../components/HoldersTable/HoldersTable'
import {
  LOSTransfer,
  TransfersTable,
} from '../components/TransfersTable/TransfersTable'
import { TokenHoldersData } from '../api/holders'
import { LOSToken } from '../../shared/losTypes'
import { TablePaginationState } from '../hooks/usePaginationState'
import { TableSortingState } from '../hooks/useSortingState'
import './styles.scss'

// Re-export for backward compatibility
export type { TablePaginationState, TableSortingState }

/**
 * Data and loading state for a single table
 */
export interface TableDataState {
  data: any
  isLoading: boolean
}

/**
 * Props for TokenTablePicker component
 */
export interface TokenTablePickerProps {
  accountId: string
  currency: string
  xrpUSDRate: string
  tokenData: LOSToken

  // Holders table state
  holdersData?: TokenHoldersData
  holdersPagination: TablePaginationState
  holdersLoading: boolean

  // Dex trades table state
  dexTradesData?: LOSDEXTransaction[]
  dexTradesPagination: TablePaginationState
  dexTradesSorting: TableSortingState
  dexTradesLoading: boolean
  onRefreshDexTrades?: () => void

  // Transfers table state
  transfersData?: LOSTransfer[]
  transfersPagination: TablePaginationState
  transfersSorting: TableSortingState
  transfersLoading: boolean
  onRefreshTransfers?: () => void
}

export const TokenTablePicker = ({
  accountId,
  currency,
  xrpUSDRate,
  tokenData,
  holdersData,
  holdersPagination,
  holdersLoading,
  dexTradesData,
  dexTradesPagination,
  dexTradesSorting,
  dexTradesLoading,
  onRefreshDexTrades,
  transfersData,
  transfersPagination,
  transfersSorting,
  transfersLoading,
  onRefreshTransfers,
}: TokenTablePickerProps) => {
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const { t } = useTranslation()

  const {
    data,
    error,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', accountId, currency],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        currency,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `token transactions ${accountId}.${currency} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)

        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
    },
  )

  const [tablePickerState, setTablePickerState] = useState<
    'all' | 'dex' | 'transfers' | 'holders'
  >('all')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialRender = useRef(true)

  // Reset table picker state when token changes
  useEffect(() => {
    setTablePickerState('all')
  }, [currency, accountId])

  // Scroll to top of table container when loading more transactions (but not on initial render)
  useEffect(() => {
    if (!loading && containerRef?.current && tablePickerState === 'all') {
      // Skip scroll on initial render
      if (isInitialRender.current) {
        isInitialRender.current = false
        return undefined
      }

      // Use requestAnimationFrame to ensure scroll happens after DOM updates
      const animationFrameId = requestAnimationFrame(() => {
        const tableContainer =
          containerRef.current?.querySelector('.transaction-table')
        if (tableContainer) {
          const rect = tableContainer.getBoundingClientRect()
          const scrollTop = window.scrollY + rect.top - 200 // Scroll higher to show tabs and table headers
          window.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      })

      // Cleanup animation frame if component unmounts
      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }
    return undefined
  }, [loading, tablePickerState])

  // Format data for tables
  const XRPUSDPrice = Number(xrpUSDRate) || 0

  const holdersFormatted: XRPLHolder[] = useMemo(
    () =>
      holdersData?.holders?.map((holder, index) => ({
        ...holder,
        rank:
          (holdersPagination.currentPage - 1) * holdersPagination.pageSize +
          index +
          1,
        value_usd: holder.balance * Number(tokenData?.price) * XRPUSDPrice,
      })) || [],
    [
      holdersData,
      holdersPagination.currentPage,
      holdersPagination.pageSize,
      tokenData?.price,
      XRPUSDPrice,
    ],
  )

  // transfers is already formatted array from pagination service
  const transfersFormatted: LOSTransfer[] = transfersData || []

  // dexTrades is already formatted array from pagination service
  const dexTradesFormatted: LOSDEXTransaction[] = dexTradesData || []

  // Helper to reset pagination to page 1
  const resetTablePagination = (setCurrentPage: (page: number) => void) => {
    setCurrentPage(1)
  }

  // Helper to render transaction table
  const renderTransactionTable = () => (
    <TransactionTable
      transactions={data?.pages?.map((page: any) => page.transactions).flat()}
      loading={loading}
      emptyMessage={error?.message ? t(error.message as any) : ''}
      onLoadMore={() => fetchNextPage()}
      hasAdditionalResults={hasNextPage}
    />
  )

  // Helper to render dex trades table
  const renderDexTradesTable = () => (
    <DexTradeTable
      transactions={dexTradesFormatted}
      isLoading={dexTradesLoading}
      totalTrades={dexTradesPagination.total}
      currentPage={dexTradesPagination.currentPage}
      onPageChange={dexTradesPagination.setCurrentPage}
      pageSize={dexTradesPagination.pageSize}
      hasMore={dexTradesPagination.hasMore}
      hasPrevPage={dexTradesPagination.hasPrevPage}
      sortField={dexTradesSorting.sortField}
      setSortField={dexTradesSorting.setSortField}
      sortOrder={dexTradesSorting.sortOrder}
      setSortOrder={dexTradesSorting.setSortOrder}
      onRefresh={onRefreshDexTrades}
    />
  )

  // Helper to render transfers table
  const renderTransfersTable = () => (
    <TransfersTable
      transactions={transfersFormatted}
      isTransfersLoading={transfersLoading}
      totalTransfers={transfersPagination.total}
      currentPage={transfersPagination.currentPage}
      onPageChange={transfersPagination.setCurrentPage}
      pageSize={transfersPagination.pageSize}
      scrollRef={containerRef}
      hasMore={transfersPagination.hasMore}
      hasPrevPage={transfersPagination.hasPrevPage}
      sortField={transfersSorting.sortField}
      setSortField={transfersSorting.setSortField}
      sortOrder={transfersSorting.sortOrder}
      setSortOrder={transfersSorting.setSortOrder}
      onRefresh={onRefreshTransfers}
    />
  )

  // Helper to render holders table
  const renderHoldersTable = () => (
    <HoldersTable
      isHoldersDataLoading={holdersLoading}
      holders={holdersFormatted}
      totalHolders={holdersPagination.total}
      currentPage={holdersPagination.currentPage}
      onPageChange={holdersPagination.setCurrentPage}
      pageSize={holdersPagination.pageSize}
    />
  )

  const tabs = [
    { id: 'all', labelKey: 'token_page.all_tx' },
    {
      id: 'dex',
      labelKey: 'token_page.dex_tx',
      onTabClick: () =>
        resetTablePagination(dexTradesPagination.setCurrentPage),
    },
    {
      id: 'transfers',
      labelKey: 'token_page.transfers_tx',
      onTabClick: () =>
        resetTablePagination(transfersPagination.setCurrentPage),
    },
    {
      id: 'holders',
      labelKey: 'token_page.holders_table',
      onTabClick: () => resetTablePagination(holdersPagination.setCurrentPage),
    },
  ]

  return (
    <div className="token-transaction-table-container" ref={containerRef}>
      <hr className="full-width-line" />
      <div className="tx-table-picker">
        <Tabs
          tabs={tabs}
          selected={tablePickerState}
          onTabChange={(tabId) =>
            setTablePickerState(
              tabId as 'all' | 'dex' | 'transfers' | 'holders',
            )
          }
        />
      </div>

      {tablePickerState === 'all' && renderTransactionTable()}

      {tablePickerState === 'dex' && renderDexTradesTable()}

      {tablePickerState === 'transfers' && renderTransfersTable()}

      {tablePickerState === 'holders' && renderHoldersTable()}
    </div>
  )
}
