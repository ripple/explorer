/**
 * Generic cursor-based pagination service with client-side caching and prefetching.
 *
 * Fetches data in large batches from an API, caches the results, and serves
 * smaller pages to the UI. When the user approaches the end of cached data,
 * it prefetches the next batch in the background for a seamless experience.
 *
 * Usage:
 *   const service = new CursorPaginationService<MyItem>({
 *     fetchFn: myApiFetchFunction,
 *     formatFn: (raw) => transformToMyItem(raw),
 *     batchSize: 200,  // items per API call
 *     pageSize: 10,    // items per UI page
 *   })
 *
 *   const page = await service.getPage('someId', 1)
 *
 * Currently used by:
 *   - DexTradesPaginationService (Token IOU page)
 *   - TransfersPaginationService (Token IOU/MPT pages)
 */

/**
 * Fetch function signature matching LOS cursor-based API endpoints.
 * The `id` parameter is typically a token ID or account ID.
 */
export type PaginationFetchFn = (
  id: string,
  size: number,
  cursor?: any,
  direction?: string,
  sortField?: string,
  sortOrder?: string,
) => Promise<{
  results: any[]
  next_cursor?: any
  prev_cursor?: any
}>

/** Transforms a raw API result into the desired output type. */
export type PaginationFormatFn<T> = (raw: any) => T

export interface PaginationResult<T> {
  items: T[]
  totalItems: number
  hasMore: boolean
  isLoading: boolean
}

interface CursorPaginationServiceOptions<T> {
  fetchFn: PaginationFetchFn
  formatFn: PaginationFormatFn<T>
  /** Number of items to fetch per API call (default: 200) */
  batchSize?: number
  /** Number of items to display per UI page (default: 10) */
  pageSize?: number
  /** Trigger prefetch when user reaches this fraction of cached data (default: 0.7) */
  prefetchThreshold?: number
}

export class CursorPaginationService<T> {
  /** Cached items keyed by "{id}:{sortField}:{sortOrder}" */
  private cache: Map<string, T[]> = new Map()

  /** Cursor for fetching the next batch (forward pagination) */
  private nextCursorCache: Map<string, any> = new Map()

  /** Cursor for fetching the previous batch (backward pagination) */
  private prevCursorCache: Map<string, any> = new Map()

  /** In-flight fetch promises to prevent duplicate requests */
  private fetchingCache: Map<string, Promise<void>> = new Map()

  /** True when the server has no more data in the forward direction */
  private hasReachedEndCache: Map<string, boolean> = new Map()

  /** True when the server has no more data in the backward direction */
  private hasReachedStartCache: Map<string, boolean> = new Map()

  private readonly fetchFn: PaginationFetchFn

  private readonly formatFn: PaginationFormatFn<T>

  private readonly BATCH_SIZE: number

  private readonly PAGE_SIZE: number

  private readonly PREFETCH_THRESHOLD: number

  constructor(options: CursorPaginationServiceOptions<T>) {
    this.fetchFn = options.fetchFn
    this.formatFn = options.formatFn
    this.BATCH_SIZE = options.batchSize ?? 200
    this.PAGE_SIZE = options.pageSize ?? 10
    this.PREFETCH_THRESHOLD = options.prefetchThreshold ?? 0.7
  }

  /** Builds a cache key from the id and sort configuration. */
  // eslint-disable-next-line class-methods-use-this
  private getCacheKey(
    id: string,
    sortField?: string,
    sortOrder?: string,
  ): string {
    const sortPart = sortField ? `:${sortField}:${sortOrder}` : ''
    return `${id}${sortPart}`
  }

  /**
   * Fetches a batch of items from the API and appends/prepends to the cache.
   * Updates cursors and end-of-data flags based on the response.
   */
  private async fetchMore(
    id: string,
    sortField?: string,
    sortOrder?: string,
    direction: string = 'next',
  ): Promise<void> {
    const cacheKey = this.getCacheKey(id, sortField, sortOrder)

    const cursor =
      direction === 'prev'
        ? this.prevCursorCache.get(cacheKey)
        : this.nextCursorCache.get(cacheKey)

    const response = await this.fetchFn(
      id,
      this.BATCH_SIZE,
      cursor,
      direction,
      sortField,
      sortOrder,
    )
    const items: T[] = []

    if (response && response.results) {
      response.results.forEach((raw: any) => {
        items.push(this.formatFn(raw))
      })
    }

    // Prepend for backward pagination, append for forward
    const existingItems = this.cache.get(cacheKey) || []
    const updatedItems =
      direction === 'prev'
        ? [...items, ...existingItems]
        : [...existingItems, ...items]
    this.cache.set(cacheKey, updatedItems)

    // Update cursors. No cursor in the response means we've reached the boundary.
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

    // Empty results also signal we've reached the boundary
    if (items.length === 0) {
      if (direction === 'prev') {
        this.hasReachedStartCache.set(cacheKey, true)
      } else {
        this.hasReachedEndCache.set(cacheKey, true)
      }
    }
  }

  /**
   * Returns a page of items. Fetches the first batch on initial call,
   * then serves from cache. Triggers a background prefetch when the user
   * reaches PREFETCH_THRESHOLD (80%) of cached data.
   */
  async getPage(
    id: string,
    page: number,
    pageSize?: number,
    sortField?: string,
    sortOrder?: string,
  ): Promise<PaginationResult<T>> {
    const cacheKey = this.getCacheKey(id, sortField, sortOrder)
    const validPageSize = pageSize && pageSize > 0 ? pageSize : this.PAGE_SIZE
    const startIndex = (page - 1) * validPageSize
    const endIndex = startIndex + validPageSize

    let allItems = this.cache.get(cacheKey) || []
    let hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false

    // Initial fetch if cache is empty
    if (allItems.length === 0) {
      await this.fetchMore(id, sortField, sortOrder)
      allItems = this.cache.get(cacheKey) || []
      hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false
    }

    // If the requested page is beyond the cache, await any in-flight prefetch
    if (endIndex > allItems.length && !hasReachedEnd) {
      const existingFetch = this.fetchingCache.get(cacheKey)
      if (existingFetch) {
        await existingFetch
        allItems = this.cache.get(cacheKey) || []
        hasReachedEnd = this.hasReachedEndCache.get(cacheKey) || false
      }
    }

    // Snapshot cache size before any background prefetch
    const cacheSizeBeforePrefetch = allItems.length

    // Prefetch the next batch in the background when approaching cache boundary
    const cacheThreshold = cacheSizeBeforePrefetch * this.PREFETCH_THRESHOLD
    if (endIndex > cacheThreshold && !hasReachedEnd) {
      const existingFetch = this.fetchingCache.get(cacheKey)
      if (!existingFetch) {
        const fetchPromise = this.fetchMore(id, sortField, sortOrder).finally(
          () => {
            this.fetchingCache.delete(cacheKey)
          },
        )
        this.fetchingCache.set(cacheKey, fetchPromise)
      }
    }

    const pageItems = allItems.slice(
      startIndex,
      Math.min(endIndex, cacheSizeBeforePrefetch),
    )

    const hasMore = endIndex < allItems.length

    return {
      items: pageItems,
      totalItems: allItems.length,
      hasMore,
      isLoading: false,
    }
  }

  /** Clears cached data. Pass an id to clear a specific entry, or omit to clear all. */
  clearCache(id?: string, sortField?: string, sortOrder?: string): void {
    if (id) {
      const cacheKey = this.getCacheKey(id, sortField, sortOrder)
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

  /** Returns the number of items currently cached for the given id. */
  getCachedItemCount(
    id: string,
    sortField?: string,
    sortOrder?: string,
  ): number {
    const cacheKey = this.getCacheKey(id, sortField, sortOrder)
    return this.cache.get(cacheKey)?.length || 0
  }
}
