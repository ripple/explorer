import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TransactionTable } from '../../../shared/components/TransactionTable/TransactionTable'
import { Tabs } from '../../../shared/components/Tabs'
import { useAccountTransactions } from '../../shared/hooks/useAccountTransactions'
import {
  HoldersTable,
  XRPLHolder,
} from '../../shared/components/HoldersTable/HoldersTable'
import {
  TransfersTable,
  LOSTransfer,
} from '../../shared/components/TransfersTable/TransfersTable'
import { TablePaginationState } from '../../shared/hooks/usePaginationState'
import { TableSortingState } from '../../shared/hooks/useSortingState'
import { convertScaledPrice } from '../../../shared/utils'
import './styles.scss'

export interface TablePickerProps {
  mptIssuanceId: string
  issuer: string
  assetScale?: number

  // Holders table state
  holdersData?: XRPLHolder[]
  holdersPagination: TablePaginationState
  holdersLoading: boolean

  // Transfers table state
  transfersData?: LOSTransfer[]
  transfersPagination: TablePaginationState
  transfersSorting: TableSortingState
  transfersLoading: boolean
  onRefreshTransfers?: () => void
}

export const TablePicker = ({
  mptIssuanceId,
  issuer,
  assetScale,
  holdersData,
  holdersPagination,
  holdersLoading,
  transfersData,
  transfersPagination,
  transfersSorting,
  transfersLoading,
  onRefreshTransfers,
}: TablePickerProps) => {
  const { t } = useTranslation()

  const { data, error, loading, fetchNextPage, hasNextPage } =
    useAccountTransactions({
      account: issuer,
      tokenId: mptIssuanceId,
      limit: 50,
    })

  const [tablePickerState, setTablePickerState] = useState<
    'all' | 'transfers' | 'holders'
  >('all')

  // Reset table picker state when token changes
  useEffect(() => {
    setTablePickerState('all')
  }, [mptIssuanceId])

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

  // Transform transfer amounts using assetScale (similar to IOU pattern)
  const transfersFormatted: LOSTransfer[] = useMemo(() => {
    if (!transfersData) {
      return []
    }
    return transfersData.map((transfer) => ({
      ...transfer,
      // Convert amount using assetScale
      amount:
        typeof transfer.amount === 'string'
          ? convertScaledPrice(BigInt(transfer.amount), assetScale ?? 0)
          : transfer.amount,
    }))
  }, [transfersData, assetScale])

  // Helper to render transfers table
  const renderTransfersTable = () => (
    <TransfersTable
      transactions={transfersFormatted}
      isTransfersLoading={transfersLoading}
      totalTransfers={transfersPagination.total}
      currentPage={transfersPagination.currentPage}
      onPageChange={transfersPagination.setCurrentPage}
      pageSize={transfersPagination.pageSize}
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
      holders={holdersData || []}
      isHoldersDataLoading={holdersLoading}
      totalHolders={holdersPagination.total}
      currentPage={holdersPagination.currentPage}
      onPageChange={holdersPagination.setCurrentPage}
      pageSize={holdersPagination.pageSize}
    />
  )

  const tabs = [
    { id: 'all', labelKey: 'mpt_page.all_tx' },
    {
      id: 'transfers',
      labelKey: 'mpt_page.transfers_tx',
      onTabClick: () =>
        resetTablePagination(transfersPagination.setCurrentPage),
    },
    {
      id: 'holders',
      labelKey: 'mpt_page.holders_table',
      onTabClick: () => resetTablePagination(holdersPagination.setCurrentPage),
    },
  ]

  return (
    <div className="mpt-transaction-table-container">
      <hr className="full-width-line" />
      <div className="tx-table-picker">
        <Tabs
          tabs={tabs}
          selected={tablePickerState}
          onTabChange={(tabId) =>
            setTablePickerState(tabId as 'all' | 'transfers' | 'holders')
          }
        />
      </div>

      {tablePickerState === 'all' && renderTransactionTable()}

      {tablePickerState === 'transfers' && renderTransfersTable()}

      {tablePickerState === 'holders' && renderHoldersTable()}
    </div>
  )
}
