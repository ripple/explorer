import axios from 'axios'
import logger from '../../../../rippled/lib/logger'

const log = logger({ name: 'tokenTx' })

const buildPaginationAndSortParams = (
  searchAfter?: any,
  direction?: string,
  sortField?: string,
  sortOrder?: string,
): URLSearchParams => {
  const params = new URLSearchParams()

  // Add search_after (cursor) if provided
  if (searchAfter) {
    params.append('search_after', JSON.stringify(searchAfter))
  }

  // Add direction if provided (e.g., 'prev' for backwards pagination)
  if (direction) {
    params.append('direction', direction)
  }

  // Add sort parameters if provided
  if (sortField) {
    params.append('sort_field', sortField)
  }

  if (sortOrder) {
    params.append('sort_order', sortOrder)
  }

  return params
}

export async function getDexTrades(
  tokenId: string,
  size?: number,
  searchAfter?: any,
  direction?: string,
  sortField?: string,
  sortOrder?: string,
): Promise<any> {
  try {
    log.info('Fetching dex trades data from LOS')
    const params = new URLSearchParams({
      token: tokenId,
      size: (size ?? 10).toString(),
    })
    const paginationParams = buildPaginationAndSortParams(
      searchAfter,
      direction,
      sortField,
      sortOrder,
    )
    paginationParams.forEach((value, key) => params.append(key, value))

    return axios
      .get(`${process.env.VITE_LOS_URL}/dex-trades?${params.toString()}`)
      .then((resp) => resp.data)
  } catch (error) {
    log.error(`Failed to fetch dex trades for ${tokenId}: ${error}`)
    throw error
  }
}

export async function getTransfers(
  tokenId: string,
  size?: number,
  searchAfter?: any,
  direction?: string,
  sortField?: string,
  sortOrder?: string,
): Promise<any> {
  try {
    log.info('Fetching transfers data from LOS')
    const params = new URLSearchParams({
      token: tokenId,
      is_transfer: 'true',
      size: (size ?? 10).toString(),
    })
    const paginationParams = buildPaginationAndSortParams(
      searchAfter,
      direction,
      sortField,
      sortOrder,
    )
    paginationParams.forEach((value, key) => params.append(key, value))

    return axios
      .get(`${process.env.VITE_LOS_URL}/v2/transactions?${params.toString()}`)
      .then((resp) => resp.data)
  } catch (error) {
    log.error(`Failed to fetch transfers for ${tokenId}: ${error}`)
    throw error
  }
}
