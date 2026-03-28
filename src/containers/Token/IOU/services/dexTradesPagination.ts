import { getDexTrades } from '../../shared/api/tokenTx'
import { ExplorerAmount } from '../../../shared/types'
import {
  CursorPaginationService,
  PaginationResult,
} from '../../../shared/services/CursorPaginationService'

export interface DexTrade {
  hash: string
  ledger: number
  timestamp: number
  from: string
  to: string
  amount_in: ExplorerAmount
  amount_out: ExplorerAmount
  rate: number | null
  type?: string
  subtype?: string
}

export interface DexTradesPaginationResult {
  trades: DexTrade[]
  totalTrades: number
  hasMore: boolean
  isLoading: boolean
}

const formatDexTrade = (trade: any): DexTrade => ({
  hash: trade.tx_hash,
  ledger: trade.ledger_index,
  timestamp: trade.timestamp,
  from: trade.from,
  to: trade.to,
  type: trade.type,
  subtype: trade.subtype,
  rate:
    trade.amount_in && Number(trade.amount_in.value) !== 0
      ? Number(trade.amount_out.value) / Number(trade.amount_in.value)
      : null,
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
})

export const paginationService = new CursorPaginationService<DexTrade>({
  fetchFn: getDexTrades,
  formatFn: formatDexTrade,
  batchSize: 100,
  pageSize: 10,
})

function toResult(
  result: PaginationResult<DexTrade>,
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
