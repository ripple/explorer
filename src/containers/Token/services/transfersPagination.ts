import { getTransfers } from '../api/tokenTx'
import { LOSTransfer } from '../components/TransfersTable/TransfersTable'

export interface TransfersPaginationResult {
  transfers: LOSTransfer[]
  totalTransfers: number
  hasMore: boolean
  isLoading: boolean
}

class TransfersPaginationService {
  private cache: Map<string, LOSTransfer[]> = new Map()

  private nextCursorCache: Map<string, any> = new Map() // tracks the next cursor for forward pagination

  private prevCursorCache: Map<string, any> = new Map() // tracks the previous cursor for backward pagination

  private fetchingCache: Map<string, Promise<void>> = new Map() // tracks in-flight requests

  private hasReachedEndCache: Map<string, boolean> = new Map() // tracks if we've fetched all available data in forward direction

  private hasReachedStartCache: Map<string, boolean> = new Map() // tracks if we've fetched all available data in backward direction

  private readonly BATCH_SIZE = 200 // Fetch 200 transactions at a time from API

  private readonly PAGE_SIZE = 10 // Display 10 transfers per page

  private readonly PREFETCH_THRESHOLD = 0.8 // Prefetch when 80% through cache

  // eslint-disable-next-line class-methods-use-this
  private getCacheKey(
    currency: string,
    issuer: string,
    sortField?: string,
    sortOrder?: string,
  ): string {
    const sortPart = sortField ? `:${sortField}:${sortOrder}` : ''
    return `${currency}:${issuer}${sortPart}`
  }

  private async fetchMoreTransfers(
    currency: string,
    issuer: string,
    sortField?: string,
    sortOrder?: string,
    direction: string = 'next',
  ): Promise<void> {
    const cacheKey = this.getCacheKey(currency, issuer, sortField, sortOrder)

    // Get the current cursor based on direction
    const cursor =
      direction === 'prev'
        ? this.prevCursorCache.get(cacheKey)
        : this.nextCursorCache.get(cacheKey)

    // Fetch 200 transactions at a time
    const response = await getTransfers(
      currency,
      issuer,
      this.BATCH_SIZE,
      cursor,
      direction,
      sortField,
      sortOrder,
    )
    const transfers: LOSTransfer[] = []

    if (response && response.results) {
      response.results.forEach((transaction: any) => {
        transfers.push({
          hash: transaction.hash,
          ledger: transaction.ledger_index,
          action: transaction.type,
          timestamp: transaction.timestamp,
          from: transaction.account,
          to: transaction.destination,
          amount: transaction.amount,
        })
      })
    }

    // Update cache based on direction
    const existingTransfers = this.cache.get(cacheKey) || []
    const updatedTransfers =
      direction === 'prev'
        ? [...transfers, ...existingTransfers] // Prepend for backward pagination
        : [...existingTransfers, ...transfers] // Append for forward pagination
    this.cache.set(cacheKey, updatedTransfers)

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

    // If we got fewer transfers than requested, we've reached the end/start
    if (transfers.length === 0) {
      if (direction === 'prev') {
        this.hasReachedStartCache.set(cacheKey, true)
      } else {
        this.hasReachedEndCache.set(cacheKey, true)
      }
    }
  }

  async getTransfersPage(
    currency: string,
    issuer: string,
    page: number,
    pageSize?: number,
    sortField?: string,
    sortOrder?: string,
  ): Promise<TransfersPaginationResult> {
    const cacheKey = this.getCacheKey(currency, issuer, sortField, sortOrder)
    // Ensure pageSize is valid
    const validPageSize = pageSize && pageSize > 0 ? pageSize : this.PAGE_SIZE
    const startIndex = (page - 1) * validPageSize
    const endIndex = startIndex + validPageSize

    let allTransfers = this.cache.get(cacheKey) || []
    const hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false

    // If cache is empty, fetch the initial batch
    if (allTransfers.length === 0) {
      await this.fetchMoreTransfers(currency, issuer, sortField, sortOrder)
      allTransfers = this.cache.get(cacheKey) || []
    }

    // Make a snapshot of the cache size BEFORE prefetch to ensure consistent slicing
    const cacheSizeBeforePrefetch = allTransfers.length

    // Check if we're approaching the end of the cache and need to prefetch
    const cacheThreshold = cacheSizeBeforePrefetch * this.PREFETCH_THRESHOLD
    if (endIndex > cacheThreshold && !hasReachedEnd) {
      // Prefetch next batch in the background (don't await)
      const existingFetch = this.fetchingCache.get(cacheKey)
      if (!existingFetch) {
        const fetchPromise = this.fetchMoreTransfers(
          currency,
          issuer,
          sortField,
          sortOrder,
        ).finally(() => {
          this.fetchingCache.delete(cacheKey)
        })
        this.fetchingCache.set(cacheKey, fetchPromise)
      }
    }

    // Get the transfers for the requested page
    // Use the snapshot size to ensure we don't get affected by concurrent prefetch
    const pageTransfers = allTransfers.slice(
      startIndex,
      Math.min(endIndex, cacheSizeBeforePrefetch),
    )
    // hasMore is true if there are more transfers after this page
    const hasMore = endIndex < allTransfers.length

    const result = {
      transfers: pageTransfers,
      totalTransfers: allTransfers.length,
      hasMore,
      isLoading: false,
    }

    return result
  }

  clearCache(
    currency?: string,
    issuer?: string,
    sortField?: string,
    sortOrder?: string,
  ): void {
    if (currency && issuer) {
      const cacheKey = this.getCacheKey(currency, issuer, sortField, sortOrder)
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

  getCachedTransfersCount(
    currency: string,
    issuer: string,
    sortField?: string,
    sortOrder?: string,
  ): number {
    const cacheKey = this.getCacheKey(currency, issuer, sortField, sortOrder)
    return this.cache.get(cacheKey)?.length || 0
  }
}

// Export a singleton instance
export const transfersPaginationService = new TransfersPaginationService()
