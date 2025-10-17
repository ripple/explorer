import { useContext, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { getAccountTransactions } from '../../../rippled'
import { TxTablePicker } from '../components/TxTablePicker/TxTablePicker'
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

export interface TokenTransactionsTableProps {
  accountId: string
  currency: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  dexTrades?: any
  isDexTradesLoading: boolean
  transfers?: any
  isTransfersLoading: boolean
  xrpUSDRate: string
  tokenData: LOSToken
  holdersPage: number
  setHoldersPage: (page: number) => void
  holdersPageSize: number
  transfersPage: number
  setTransfersPage: (page: number) => void
  transfersPageSize: number
  dexTradesPage: number
  setDexTradesPage: (page: number) => void
  dexTradesPageSize: number
  totalDexTrades: number
  totalTransfers?: number
  dexTradesHasMore?: boolean
  dexTradesHasPrevPage?: boolean
  transfersHasMore?: boolean
  transfersHasPrevPage?: boolean
  dexTradesSortField?: string
  setDexTradesSortField?: (field: string) => void
  dexTradesSortOrder?: 'asc' | 'desc'
  setDexTradesSortOrder?: (order: 'asc' | 'desc') => void
  transfersSortField?: string
  setTransfersSortField?: (field: string) => void
  transfersSortOrder?: 'asc' | 'desc'
  setTransfersSortOrder?: (order: 'asc' | 'desc') => void
  onRefreshDexTrades?: () => void
  onRefreshTransfers?: () => void
}

export const TokenTransactionTable = ({
  accountId,
  currency,
  holdersData,
  isHoldersDataLoading,
  dexTrades,
  isDexTradesLoading,
  transfers,
  isTransfersLoading,
  xrpUSDRate,
  tokenData,
  holdersPage,
  setHoldersPage,
  holdersPageSize,
  transfersPage,
  setTransfersPage,
  transfersPageSize,
  dexTradesPage,
  setDexTradesPage,
  dexTradesPageSize,
  totalDexTrades,
  totalTransfers = 0,
  dexTradesHasMore = false,
  dexTradesHasPrevPage = false,
  transfersHasMore = false,
  transfersHasPrevPage = false,
  dexTradesSortField,
  setDexTradesSortField,
  dexTradesSortOrder,
  setDexTradesSortOrder,
  transfersSortField,
  setTransfersSortField,
  transfersSortOrder,
  setTransfersSortOrder,
  onRefreshDexTrades,
  onRefreshTransfers,
}: TokenTransactionsTableProps) => {
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

  // Reset table picker state when token changes
  useEffect(() => {
    setTablePickerState('all')
  }, [currency, accountId])

  // Format data for tables
  const XRPUSDPrice = Number(xrpUSDRate) || 0

  const holdersFormatted: XRPLHolder[] =
    holdersData?.holders.map((holder, index) => ({
      ...holder,
      rank: (holdersPage - 1) * holdersPageSize + index + 1,
      value_usd: holder.balance * Number(tokenData?.price) * XRPUSDPrice,
    })) || []

  // transfers is already formatted array from pagination service
  const transfersFormatted: LOSTransfer[] = transfers || []

  // dexTrades is already formatted array from pagination service
  const dexTradesFormatted: LOSDEXTransaction[] = dexTrades || []

  return (
    <div className="token-transaction-table-container" ref={containerRef}>
      <TxTablePicker
        tablePickerState={tablePickerState}
        setTablePickerState={setTablePickerState}
        onHoldersTabClick={() => setHoldersPage(1)}
        onTransfersTabClick={() => setTransfersPage(1)}
        onDexTabClick={() => setDexTradesPage(1)}
      />

      {tablePickerState === 'all' && (
        <TransactionTable
          transactions={data?.pages
            ?.map((page: any) => page.transactions)
            .flat()}
          loading={loading}
          emptyMessage={error?.message ? t(error.message as any) : ''}
          onLoadMore={() => fetchNextPage()}
          hasAdditionalResults={hasNextPage}
        />
      )}

      {tablePickerState === 'dex' && (
        <DexTradeTable
          transactions={dexTradesFormatted}
          isLoading={isDexTradesLoading}
          totalTrades={totalDexTrades}
          currentPage={dexTradesPage}
          onPageChange={setDexTradesPage}
          pageSize={dexTradesPageSize}
          scrollRef={containerRef}
          hasMore={dexTradesHasMore}
          hasPrevPage={dexTradesHasPrevPage}
          sortField={dexTradesSortField}
          setSortField={setDexTradesSortField}
          sortOrder={dexTradesSortOrder}
          setSortOrder={setDexTradesSortOrder}
          onRefresh={onRefreshDexTrades}
        />
      )}

      {tablePickerState === 'transfers' && (
        <TransfersTable
          transactions={transfersFormatted}
          isTransfersLoading={isTransfersLoading}
          totalTransfers={totalTransfers}
          currentPage={transfersPage}
          onPageChange={setTransfersPage}
          pageSize={transfersPageSize}
          scrollRef={containerRef}
          hasMore={transfersHasMore}
          hasPrevPage={transfersHasPrevPage}
          sortField={transfersSortField}
          setSortField={setTransfersSortField}
          sortOrder={transfersSortOrder}
          setSortOrder={setTransfersSortOrder}
          onRefresh={onRefreshTransfers}
        />
      )}

      {tablePickerState === 'holders' && (
        <HoldersTable
          isHoldersDataLoading={isHoldersDataLoading}
          holders={holdersFormatted}
          totalHolders={holdersData?.totalHolders || 0}
          currentPage={holdersPage}
          onPageChange={setHoldersPage}
          pageSize={holdersPageSize}
          scrollRef={containerRef}
        />
      )}
    </div>
  )
}
