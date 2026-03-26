import { getDexTrades } from '../../shared/api/tokenTx'
import { ExplorerAmount } from '../../../shared/types'

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

class DexTradesPaginationService {
  private cache: Map<string, DexTrade[]> = new Map()

  private nextCursorCache: Map<string, any> = new Map() // tracks the next cursor for forward pagination

  private prevCursorCache: Map<string, any> = new Map() // tracks the previous cursor for backward pagination

  private fetchingCache: Map<string, Promise<void>> = new Map() // tracks in-flight requests

  private hasReachedEndCache: Map<string, boolean> = new Map() // tracks if we've fetched all available data in forward direction

  private hasReachedStartCache: Map<string, boolean> = new Map() // tracks if we've fetched all available data in backward direction

  private readonly BATCH_SIZE = 200 // Fetch 200 transactions at a time from API

  private readonly PAGE_SIZE = 10 // Display 10 trades per page

  private readonly PREFETCH_THRESHOLD = 0.8 // Prefetch when 80% through cache

  // eslint-disable-next-line class-methods-use-this
  private getCacheKey(
    tokenId: string,
    sortField?: string,
    sortOrder?: string,
  ): string {
    const sortPart = sortField ? `:${sortField}:${sortOrder}` : ''
    return `${tokenId}${sortPart}`
  }

  // eslint-disable-next-line class-methods-use-this
  private formatDexTrade(trade: any, transaction: any): DexTrade {
    return {
      hash: transaction.hash,
      ledger: transaction.ledger_index,
      timestamp: transaction.timestamp,
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
    }
  }

  private async fetchMoreTrades(
    tokenId: string,
    sortField?: string,
    sortOrder?: string,
    direction: string = 'next',
  ): Promise<void> {
    const cacheKey = this.getCacheKey(tokenId, sortField, sortOrder)

    // Get the current cursor based on direction
    const cursor =
      direction === 'prev'
        ? this.prevCursorCache.get(cacheKey)
        : this.nextCursorCache.get(cacheKey)

    // Fetch 200 transactions at a time
    const response = await getDexTrades(
      tokenId,
      this.BATCH_SIZE,
      cursor,
      direction,
      sortField,
      sortOrder,
    )
    const trades: DexTrade[] = []

    if (response && response.results) {
      response.results.forEach((transaction: any) => {
        if (transaction.dex_trades && Array.isArray(transaction.dex_trades)) {
          transaction.dex_trades.forEach((trade: any) => {
            trades.push(this.formatDexTrade(trade, transaction))
          })
        }
      })
    }

    // Update cache based on direction
    const existingTrades = this.cache.get(cacheKey) || []
    const updatedTrades =
      direction === 'prev'
        ? [...trades, ...existingTrades] // Prepend for backward pagination
        : [...existingTrades, ...trades] // Append for forward pagination
    this.cache.set(cacheKey, updatedTrades)

    // Update cursors for next fetch
    if (direction === 'prev') {
      if (response && response.prev_cursor) {
        this.prevCursorCache.set(cacheKey, response.prev_cursor)
      } else {
        this.hasReachedStartCache.set(cacheKey, true)
      }
    } else if (response && response.next_cursor) {
      this.nextCursorCache.set(cacheKey, response.next_cursor)
    } else {
      this.hasReachedEndCache.set(cacheKey, true)
    }

    // If we got fewer trades than requested, we've reached the end/start
    if (trades.length === 0) {
      if (direction === 'prev') {
        this.hasReachedStartCache.set(cacheKey, true)
      } else {
        this.hasReachedEndCache.set(cacheKey, true)
      }
    }
  }

  async getDexTradesPage(
    tokenId: string,
    page: number,
    pageSize?: number,
    sortField?: string,
    sortOrder?: string,
  ): Promise<DexTradesPaginationResult> {
    const cacheKey = this.getCacheKey(tokenId, sortField, sortOrder)
    // Ensure pageSize is valid
    const validPageSize = pageSize && pageSize > 0 ? pageSize : this.PAGE_SIZE
    const startIndex = (page - 1) * validPageSize
    const endIndex = startIndex + validPageSize

    let allTrades = this.cache.get(cacheKey) || []
    let hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false

    // If cache is empty, fetch the initial batch
    if (allTrades.length === 0) {
      await this.fetchMoreTrades(tokenId, sortField, sortOrder)
      allTrades = this.cache.get(cacheKey) || []
      // Update hasReachedEnd after fetching
      hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false
    }

    // Make a snapshot of the cache size BEFORE prefetch to ensure consistent slicing
    const cacheSizeBeforePrefetch = allTrades.length

    // Check if we're approaching the end of the cache and need to prefetch
    const cacheThreshold = cacheSizeBeforePrefetch * this.PREFETCH_THRESHOLD
    if (endIndex > cacheThreshold && !hasReachedEnd) {
      // Prefetch next batch in the background (don't await)
      const existingFetch = this.fetchingCache.get(cacheKey)
      if (!existingFetch) {
        const fetchPromise = this.fetchMoreTrades(
          tokenId,
          sortField,
          sortOrder,
        ).finally(() => {
          this.fetchingCache.delete(cacheKey)
        })
        this.fetchingCache.set(cacheKey, fetchPromise)
      }
    }

    // Get the trades for the requested page
    // Use the snapshot size to ensure we don't get affected by concurrent prefetch
    const pageTrades = allTrades.slice(
      startIndex,
      Math.min(endIndex, cacheSizeBeforePrefetch),
    )
    // hasMore is true if there are more trades after this page
    const hasMore = endIndex < allTrades.length

    const result = {
      trades: pageTrades,
      totalTrades: allTrades.length,
      hasMore,
      isLoading: false,
    }

    return result
  }

  clearCache(tokenId?: string, sortField?: string, sortOrder?: string): void {
    if (tokenId) {
      const cacheKey = this.getCacheKey(tokenId, sortField, sortOrder)
      this.cache.delete(cacheKey)
      this.nextCursorCache.delete(cacheKey)
      this.prevCursorCache.delete(cacheKey)
      this.fetchingCache.delete(cacheKey)
      this.hasReachedEndCache.delete(cacheKey)
      this.hasReachedStartCache.delete(cacheKey)
    } else {
      this.cache.clear()
      this.nextCursorCache.clear()
      this.prevCursorCache.clear()
      this.fetchingCache.clear()
      this.hasReachedEndCache.clear()
      this.hasReachedStartCache.clear()
    }
  }

  getCachedTradesCount(tokenId: string): number {
    const cacheKey = this.getCacheKey(tokenId)
    return this.cache.get(cacheKey)?.length || 0
  }
}

// Export a singleton instance
export const dexTradesPaginationService = new DexTradesPaginationService()
