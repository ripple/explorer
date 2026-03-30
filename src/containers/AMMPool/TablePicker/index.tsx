import { FC, useState, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useInfiniteQuery } from 'react-query'
import { Tabs } from '../../shared/components/Tabs'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import SocketContext from '../../shared/SocketContext'
import { useAnalytics } from '../../shared/analytics'
import { getAccountTransactions } from '../../../rippled'
import {
  DexTradeTable,
  LOSDEXTransaction,
} from '../../shared/components/DexTradeTable/DexTradeTable'
import {
  HoldersTable,
  XRPLHolder,
} from '../../shared/components/HoldersTable/HoldersTable'
import { CursorPaginationService } from '../../shared/services/CursorPaginationService'
import { useCursorPaginatedQuery } from '../../shared/hooks/useCursorPaginatedQuery'
import { fetchAMMDexTrades, fetchAMMTransactions } from '../api'
import { AMMDepositWithdrawTable } from './AMMDepositWithdrawTable'
import { AMMDepositWithdrawTx, FormattedBalance } from '../types'
import getTokenHolders from '../../Token/IOU/api/holders'

const PAGE_SIZE = 10

// Format DEX trade from LOS /dex-trades response
const formatDexTrade = (trade: any): LOSDEXTransaction => ({
  hash: trade.tx_hash,
  ledger: trade.ledger_index,
  timestamp: trade.timestamp,
  from: trade.from,
  to: trade.to,
  type: trade.type,
  amount_in: {
    currency: trade.amount_in.currency,
    issuer: trade.amount_in.issuer,
    amount: Number(trade.amount_in.value),
  },
  amount_out: {
    currency: trade.amount_out.currency,
    issuer: trade.amount_out.issuer,
    amount: Number(trade.amount_out.value),
  },
  rate:
    trade.amount_in && Number(trade.amount_in.value) !== 0
      ? Number(trade.amount_out.value) / Number(trade.amount_in.value)
      : null,
})

/**
 * Format AMMDeposit/AMMWithdraw from LOS /v2/transactions response.
 * Maps asset1/asset2 from the response to the ordered asset/asset2 fields
 * based on the AMM pool's canonical asset ordering (XRP on right, or alphabetical).
 */
const buildFormatDepositWithdraw =
  (
    orderedAsset1: FormattedBalance | null,
    orderedAsset2: FormattedBalance | null,
  ) =>
  (tx: any): AMMDepositWithdrawTx => {
    const responseAssets = [tx.amm?.asset1, tx.amm?.asset2].filter(Boolean)

    const matchAsset = (target: FormattedBalance | null) => {
      if (!target) return null
      const found = responseAssets.find(
        (a: any) =>
          a.currency === target.currency &&
          (a.issuer ?? null) === (target.issuer ?? null),
      )
      if (!found) return null
      return {
        currency: found.currency,
        issuer: found.issuer ?? undefined,
        amount: Number(found.value),
      }
    }

    return {
      hash: tx.hash,
      ledger: tx.ledger_index,
      timestamp: tx.timestamp,
      account: tx.account,
      asset: matchAsset(orderedAsset1),
      asset2: matchAsset(orderedAsset2),
      lpTokens:
        tx.amm?.lp_tokens_received ?? tx.amm?.lp_tokens_redeemed ?? null,
      valueUsd: tx.amm?.value_usd ?? null,
    }
  }

// Create pagination service instances for each tab
const dexTradesPagination = new CursorPaginationService<LOSDEXTransaction>({
  fetchFn: (id, size, cursor, direction, sortField, sortOrder) =>
    fetchAMMDexTrades(id, size, cursor, direction, sortField, sortOrder),
  formatFn: formatDexTrade,
  batchSize: 200,
  pageSize: PAGE_SIZE,
})

let depositsPagination: CursorPaginationService<AMMDepositWithdrawTx> | null =
  null
let withdrawalsPagination: CursorPaginationService<AMMDepositWithdrawTx> | null =
  null

interface AMMPoolTablePickerProps {
  ammAccountId: string
  tab: string
  isMainnet: boolean
  lpToken?: { currency: string; issuer: string; value: string }
  asset1: FormattedBalance | null
  asset2: FormattedBalance | null
  tvlUsd?: number
  isLiquidated?: boolean
}

export const AMMPoolTablePicker: FC<AMMPoolTablePickerProps> = ({
  ammAccountId,
  tab,
  isMainnet,
  lpToken,
  asset1,
  asset2,
  tvlUsd,
  isLiquidated = false,
}) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const [activeTab, setActiveTab] = useState(tab || 'transactions')

  // Lazily create pagination services with the correct asset ordering
  if (!depositsPagination) {
    depositsPagination = new CursorPaginationService<AMMDepositWithdrawTx>({
      fetchFn: (id, size, cursor, direction) =>
        fetchAMMTransactions(id, 'AMMDeposit', size, cursor, direction),
      formatFn: buildFormatDepositWithdraw(asset1, asset2),
      batchSize: 200,
      pageSize: PAGE_SIZE,
    })
  }
  if (!withdrawalsPagination) {
    withdrawalsPagination = new CursorPaginationService<AMMDepositWithdrawTx>({
      fetchFn: (id, size, cursor, direction) =>
        fetchAMMTransactions(id, 'AMMWithdraw', size, cursor, direction),
      formatFn: buildFormatDepositWithdraw(asset1, asset2),
      batchSize: 200,
      pageSize: PAGE_SIZE,
    })
  }

  // All Transactions — fetch via rippled account_tx
  const {
    data: txData,
    error: txError,
    isFetching: txLoading,
    fetchNextPage: txFetchNextPage,
    hasNextPage: txHasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', ammAccountId],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        ammAccountId,
        undefined,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((err) => {
        trackException(
          `account transactions ${ammAccountId} at ${pageParam} --- ${JSON.stringify(err)}`,
        )
        throw new Error('get_account_transactions_failed')
      }),
    { getNextPageParam: (lastPage) => lastPage.marker },
  )
  const allTransactions =
    txData?.pages?.reduce(
      (acc: any[], page: any) =>
        page.transactions ? acc.concat(page.transactions) : acc,
      [],
    ) || []
  const getTxEmptyMessage = () => {
    if (allTransactions.length === 0 && txData?.pages[0]?.transactions) {
      return t('get_account_transactions_try' as any)
    }
    return txError?.message ? t(txError.message as any) : ''
  }
  const txEmptyMessage = getTxEmptyMessage()

  // DEX Trades — using shared hook
  const dexTrades = useCursorPaginatedQuery({
    service: dexTradesPagination,
    id: ammAccountId,
    pageSize: PAGE_SIZE,
    enabled: isMainnet,
  })

  // Deposits — using shared hook
  const deposits = useCursorPaginatedQuery({
    service: depositsPagination,
    id: ammAccountId,
    pageSize: PAGE_SIZE,
    enabled: isMainnet,
  })

  // Withdrawals — using shared hook
  const withdrawals = useCursorPaginatedQuery({
    service: withdrawalsPagination!,
    id: ammAccountId,
    pageSize: PAGE_SIZE,
    enabled: isMainnet,
  })

  // Holders
  const holdersPageSize = 20
  const [holdersPage, setHoldersPage] = useState(1)
  const { data: holdersData, isLoading: holdersLoading } = useQuery(
    ['ammHolders', lpToken?.currency, lpToken?.issuer, holdersPage],
    () =>
      getTokenHolders(
        lpToken!.currency,
        lpToken!.issuer,
        holdersPageSize,
        (holdersPage - 1) * holdersPageSize,
      ),
    { enabled: isMainnet && !!lpToken?.currency },
  )

  // Calculate USD value for each holder based on their LP token share of TVL
  const holdersFormatted: XRPLHolder[] = (holdersData?.holders || []).map(
    (holder: any, index: number) => {
      let holderUsd: number | null = null
      if (tvlUsd != null && lpToken?.value) {
        const totalLP = Number(lpToken.value)
        if (totalLP > 0) {
          holderUsd = (Number(holder.balance) / totalLP) * tvlUsd
        }
      }
      return {
        ...holder,
        rank: (holdersPage - 1) * holdersPageSize + index + 1,
        value_usd: holderUsd,
      }
    },
  )

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  const tabs = [
    { id: 'transactions', labelKey: 'all_transactions' },
    ...(isMainnet
      ? [
          { id: 'dex-trades', labelKey: 'dex_trades' },
          { id: 'deposits', labelKey: 'deposits' },
          { id: 'withdrawals', labelKey: 'withdrawals' },
          ...(!isLiquidated ? [{ id: 'holders', labelKey: 'holders' }] : []),
        ]
      : []),
  ]

  return (
    <div className="amm-pool-tables">
      <hr className="full-width-line" />
      <div className="tx-table-picker">
        <Tabs tabs={tabs} selected={activeTab} onTabChange={handleTabChange} />
      </div>

      {activeTab === 'transactions' && (
        <TransactionTable
          transactions={allTransactions}
          loading={txLoading}
          hasTokensColumn
          emptyMessage={txEmptyMessage}
          onLoadMore={() => txFetchNextPage()}
          hasAdditionalResults={txHasNextPage}
        />
      )}

      {activeTab === 'dex-trades' && isMainnet && (
        <DexTradeTable
          transactions={dexTrades.data?.items || []}
          isLoading={dexTrades.isLoading}
          totalTrades={dexTrades.data?.totalItems || 0}
          currentPage={dexTrades.page}
          onPageChange={dexTrades.setPage}
          pageSize={PAGE_SIZE}
          hasMore={dexTrades.data?.hasMore}
          hasPrevPage={dexTrades.page > 1}
          hideType
          sortField={dexTrades.sortField}
          setSortField={dexTrades.setSortField}
          sortOrder={dexTrades.sortOrder}
          setSortOrder={dexTrades.setSortOrder}
          onRefresh={dexTrades.refresh}
        />
      )}

      {activeTab === 'deposits' && isMainnet && (
        <AMMDepositWithdrawTable
          transactions={deposits.data?.items || []}
          isLoading={deposits.isLoading}
          totalItems={deposits.data?.totalItems || 0}
          currentPage={deposits.page}
          onPageChange={deposits.setPage}
          pageSize={PAGE_SIZE}
          hasMore={deposits.data?.hasMore || false}
          type="deposit"
        />
      )}

      {activeTab === 'withdrawals' && isMainnet && (
        <AMMDepositWithdrawTable
          transactions={withdrawals.data?.items || []}
          isLoading={withdrawals.isLoading}
          totalItems={withdrawals.data?.totalItems || 0}
          currentPage={withdrawals.page}
          onPageChange={withdrawals.setPage}
          pageSize={PAGE_SIZE}
          hasMore={withdrawals.data?.hasMore || false}
          type="withdraw"
        />
      )}

      {activeTab === 'holders' && isMainnet && (
        <HoldersTable
          holders={holdersFormatted}
          isHoldersDataLoading={holdersLoading}
          totalHolders={holdersData?.totalHolders || 0}
          currentPage={holdersPage}
          onPageChange={setHoldersPage}
          pageSize={holdersPageSize}
        />
      )}
    </div>
  )
}
