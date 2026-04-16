import { getDexTrades } from '../../shared/api/tokenTx'
import { DexTradeFormatted } from '../../../shared/components/DexTradeTable/DexTradeTable'
import { formatDexTrade } from '../../../shared/components/DexTradeTable/formatDexTrade'
import {
  CursorPaginationService,
  PaginationResult,
} from '../../../shared/services/CursorPaginationService'

export interface DexTradesPaginationResult {
  trades: DexTradeFormatted[]
  totalTrades: number
  hasMore: boolean
  isLoading: boolean
}

export const paginationService = new CursorPaginationService<DexTradeFormatted>(
  {
    fetchFn: getDexTrades,
    formatFn: formatDexTrade,
    batchSize: 200,
    pageSize: 10,
  },
)

function toResult(
  result: PaginationResult<DexTradeFormatted>,
): DexTradesPaginationResult {
  return {
    trades: result.items,
    totalTrades: result.totalItems,
    hasMore: result.hasMore,
    isLoading: result.isLoading,
  }
}

export const dexTradesPaginationService = {
  async getDexTradesPage(
    tokenId: string,
    page: number,
    pageSize?: number,
    sortField?: string,
    sortOrder?: string,
  ): Promise<DexTradesPaginationResult> {
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

  getCachedTradesCount(tokenId: string): number {
    return paginationService.getCachedItemCount(tokenId)
  },
}
