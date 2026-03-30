import { getTransfers } from '../api/tokenTx'
import { LOSTransfer } from '../components/TransfersTable/TransfersTable'
import {
  CursorPaginationService,
  PaginationResult,
} from '../../../shared/services/CursorPaginationService'

export interface TransfersPaginationResult {
  transfers: LOSTransfer[]
  totalTransfers: number
  hasMore: boolean
  isLoading: boolean
}

const formatTransfer = (transaction: any): LOSTransfer => ({
  hash: transaction.hash,
  ledger: transaction.ledger_index,
  action: transaction.type,
  timestamp: transaction.timestamp,
  from: transaction.account,
  to: transaction.destination,
  amount: transaction.amount,
})

export const paginationService = new CursorPaginationService<LOSTransfer>({
  fetchFn: getTransfers,
  formatFn: formatTransfer,
  batchSize: 200,
  pageSize: 10,
})

function toResult(
  result: PaginationResult<LOSTransfer>,
): TransfersPaginationResult {
  return {
    transfers: result.items,
    totalTransfers: result.totalItems,
    hasMore: result.hasMore,
    isLoading: result.isLoading,
  }
}

export const transfersPaginationService = {
  async getTransfersPage(
    tokenId: string,
    page: number,
    pageSize?: number,
    sortField?: string,
    sortOrder?: string,
  ): Promise<TransfersPaginationResult> {
    const result = await paginationService.getPage(
      tokenId,
      page,
      pageSize,
      sortField,
      sortOrder,
    )
    return toResult(result)
  },

  clearCache(tokenId?: string, sortField?: string, sortOrder?: string): void {
    paginationService.clearCache(tokenId, sortField, sortOrder)
  },

  getCachedTransfersCount(
    tokenId: string,
    sortField?: string,
    sortOrder?: string,
  ): number {
    return paginationService.getCachedItemCount(tokenId, sortField, sortOrder)
  },
}
