import { getDexTrades } from '../api/tokenTx'
import { ExplorerAmount } from '../../shared/types'

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

  private apiOffsetCache: Map<string, number> = new Map() // tracks the offset for the next API call

  private fetchingCache: Map<string, Promise<void>> = new Map() // tracks in-flight requests

  private hasReachedEndCache: Map<string, boolean> = new Map() // tracks if we've fetched all available data

  private readonly BATCH_SIZE = 200 // Fetch 200 transactions at a time from API

  private readonly PAGE_SIZE = 10 // Display 10 trades per page

  private readonly PREFETCH_THRESHOLD = 0.8 // Prefetch when 80% through cache

  // eslint-disable-next-line class-methods-use-this
  private getCacheKey(currency: string, issuer: string): string {
    return `${currency}:${issuer}`
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
        trade.amount_out && Number(trade.amount_out.value) !== 0
          ? Number(trade.amount_in.value) / Number(trade.amount_out.value)
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
    currency: string,
    issuer: string,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(currency, issuer)

    // Get the current offset for the next batch
    const offset = this.apiOffsetCache.get(cacheKey) || 0

    // Fetch 200 transactions at a time
    const response = await getDexTrades(
      currency,
      issuer,
      offset,
      this.BATCH_SIZE,
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

    // Update cache
    const existingTrades = this.cache.get(cacheKey) || []
    const updatedTrades = [...existingTrades, ...trades]
    this.cache.set(cacheKey, updatedTrades)

    // Update offset for next fetch
    this.apiOffsetCache.set(cacheKey, offset + this.BATCH_SIZE)

    // If we got fewer trades than requested, we've reached the end
    if (trades.length === 0) {
      this.hasReachedEndCache.set(cacheKey, true)
    }
  }

  async getDexTradesPage(
    currency: string,
    issuer: string,
    page: number,
    pageSize: number = this.PAGE_SIZE,
  ): Promise<DexTradesPaginationResult> {
    const cacheKey = this.getCacheKey(currency, issuer)
    // Ensure pageSize is valid
    const validPageSize = pageSize && pageSize > 0 ? pageSize : this.PAGE_SIZE
    const startIndex = (page - 1) * validPageSize
    const endIndex = startIndex + validPageSize

    let allTrades = this.cache.get(cacheKey) || []
    const hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false

    // If cache is empty, fetch the initial batch
    if (allTrades.length === 0) {
      await this.fetchMoreTrades(currency, issuer)
      allTrades = this.cache.get(cacheKey) || []
    }

    // Make a snapshot of the cache size BEFORE prefetch to ensure consistent slicing
    const cacheSizeBeforePrefetch = allTrades.length

    // Check if we're approaching the end of the cache and need to prefetch
    const cacheThreshold = cacheSizeBeforePrefetch * this.PREFETCH_THRESHOLD
    if (endIndex > cacheThreshold && !hasReachedEnd) {
      // Prefetch next batch in the background (don't await)
      const existingFetch = this.fetchingCache.get(cacheKey)
      if (!existingFetch) {
        const fetchPromise = this.fetchMoreTrades(currency, issuer).finally(
          () => {
            this.fetchingCache.delete(cacheKey)
          },
        )
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

  clearCache(currency?: string, issuer?: string): void {
    if (currency && issuer) {
      const cacheKey = this.getCacheKey(currency, issuer)
      this.cache.delete(cacheKey)
      this.apiOffsetCache.delete(cacheKey)
      this.fetchingCache.delete(cacheKey)
      this.hasReachedEndCache.delete(cacheKey)
    } else {
      this.cache.clear()
      this.apiOffsetCache.clear()
      this.fetchingCache.clear()
      this.hasReachedEndCache.clear()
    }
  }

  getCachedTradesCount(currency: string, issuer: string): number {
    const cacheKey = this.getCacheKey(currency, issuer)
    return this.cache.get(cacheKey)?.length || 0
  }
}

// Export a singleton instance
export const dexTradesPaginationService = new DexTradesPaginationService()
