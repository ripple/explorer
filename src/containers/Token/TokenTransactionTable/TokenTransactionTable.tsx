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
import { TokenHoldersData } from '../../../rippled/holders'
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

  const [tablePickerState, setTablePickerState] = useState('all')
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset table picker state when token changes
  useEffect(() => {
    setTablePickerState('all')
  }, [currency, accountId])

  // assign rank to each holder and calculate USD value
  const XRPUSDPrice = Number(xrpUSDRate) || 0
  let holdersFormatted: XRPLHolder[] = []
  holdersFormatted =
    holdersData?.holders.map((holder, index) => ({
      ...holder,
      rank: (holdersPage - 1) * holdersPageSize + index + 1,
      value_usd: holder.balance * Number(tokenData?.price) * XRPUSDPrice,
    })) || []

  let transfersFormatted: LOSTransfer[] = []
  transfersFormatted =
    transfers?.results.map((transfer) => ({
      hash: transfer.hash,
      ledger: transfer.ledger_index,
      action: transfer.type,
      timestamp: transfer.timestamp, // format ripple epoch time
      from: transfer.account,
      to: transfer.destination,
      amount: transfer.amount,
    })) || []

  let dexTradesFormatted: LOSDEXTransaction[] = []
  console.log('[TokenTransactionTable] dexTrades received:', {
    length: dexTrades?.length,
    isArray: Array.isArray(dexTrades),
    dexTrades,
  })
  if (dexTrades && Array.isArray(dexTrades)) {
    // dexTrades is already formatted array from pagination service
    dexTradesFormatted = dexTrades
    console.log('[TokenTransactionTable] dexTradesFormatted:', {
      length: dexTradesFormatted.length,
    })
  }

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
          emptyMessage={t(error?.message || ('' as any))}
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
        />
      )}

      {tablePickerState === 'transfers' && (
        <TransfersTable
          transactions={transfersFormatted}
          isTransfersLoading={isTransfersLoading}
          totalTransfers={transfers?.total || 0}
          currentPage={transfersPage}
          onPageChange={setTransfersPage}
          pageSize={transfersPageSize}
          scrollRef={containerRef}
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
