import { getDexTrades } from '../../../rippled/tokenTx'
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
}

export interface DexTradesPaginationResult {
  trades: DexTrade[]
  totalTrades: number
  hasMore: boolean
  isLoading: boolean
}

class DexTradesPaginationService {
  private cache: Map<string, DexTrade[]> = new Map()
  private totalTradesCache: Map<string, number> = new Map()
  private apiPageCache: Map<string, number> = new Map() // tracks which API page we're on
  private isLoadingCache: Map<string, boolean> = new Map()

  private getCacheKey(currency: string, issuer: string): string {
    return `${currency}:${issuer}`
  }

  private formatDexTrade(trade: any, transaction: any): DexTrade {
    return {
      hash: transaction.hash,
      ledger: transaction.ledger_index,
      timestamp: transaction.timestamp,
      from: trade.from,
      to: trade.to,
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
    apiPage: number,
  ): Promise<{ trades: DexTrade[]; total: number }> {
    const cacheKey = this.getCacheKey(currency, issuer)
    this.isLoadingCache.set(cacheKey, true)

    try {
      const response = await getDexTrades(currency, issuer, apiPage * 10, 10)
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
      this.cache.set(cacheKey, [...existingTrades, ...trades])
      this.totalTradesCache.set(cacheKey, response?.total || 0)
      this.apiPageCache.set(cacheKey, apiPage)

      return { trades, total: response?.total || 0 }
    } finally {
      this.isLoadingCache.set(cacheKey, false)
    }
  }

  async getDexTradesPage(
    currency: string,
    issuer: string,
    page: number,
    pageSize: number = 10,
  ): Promise<DexTradesPaginationResult> {
    const cacheKey = this.getCacheKey(currency, issuer)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    let allTrades = this.cache.get(cacheKey) || []
    let totalTrades = this.totalTradesCache.get(cacheKey) || 0
    const currentApiPage = this.apiPageCache.get(cacheKey) || 0
    const isLoading = this.isLoadingCache.get(cacheKey) || false

    // Check if we need to fetch more data
    while (allTrades.length < endIndex && !isLoading) {
      const nextApiPage = Math.floor(allTrades.length / 10) // Estimate which API page to fetch

      // Avoid fetching the same page multiple times
      if (nextApiPage <= currentApiPage) {
        break
      }

      const { trades: newTrades, total } = await this.fetchMoreTrades(
        currency,
        issuer,
        nextApiPage,
      )

      allTrades = this.cache.get(cacheKey) || []
      totalTrades = total

      // If we got no new trades, we've reached the end
      if (newTrades.length === 0) {
        break
      }
    }

    // Get the trades for the requested page
    const pageTrades = allTrades.slice(startIndex, endIndex)
    const hasMore =
      allTrades.length > endIndex || allTrades.length < totalTrades

    const result = {
      trades: pageTrades,
      totalTrades,
      hasMore,
      isLoading: this.isLoadingCache.get(cacheKey) || false,
    }

    return result
  }

  clearCache(currency?: string, issuer?: string): void {
    if (currency && issuer) {
      const cacheKey = this.getCacheKey(currency, issuer)
      this.cache.delete(cacheKey)
      this.totalTradesCache.delete(cacheKey)
      this.apiPageCache.delete(cacheKey)
      this.isLoadingCache.delete(cacheKey)
    } else {
      this.cache.clear()
      this.totalTradesCache.clear()
      this.apiPageCache.clear()
      this.isLoadingCache.clear()
    }
  }

  getCachedTradesCount(currency: string, issuer: string): number {
    const cacheKey = this.getCacheKey(currency, issuer)
    return this.cache.get(cacheKey)?.length || 0
  }

  getTotalTrades(currency: string, issuer: string): number {
    const cacheKey = this.getCacheKey(currency, issuer)
    return this.totalTradesCache.get(cacheKey) || 0
  }
}

// Export a singleton instance
export const dexTradesPaginationService = new DexTradesPaginationService()
