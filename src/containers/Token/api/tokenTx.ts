import axios from 'axios'
import logger from '../../../rippled/lib/logger'

const log = logger({ name: 'iou-tokenTx' })

const fetchTokenTransactions = (
  currency: string,
  issuer: string,
  transactionType: string,
  size: number,
  searchAfter?: any,
  direction?: string,
): Promise<any> => {
  const params = new URLSearchParams({
    token: `${currency}.${issuer}`,
    transactionType,
    size: size.toString(),
  })

  // Add search_after (cursor) if provided
  if (searchAfter) {
    params.append('search_after', JSON.stringify(searchAfter))
  }

  // Add direction if provided (e.g., 'prev' for backwards pagination)
  if (direction) {
    params.append('direction', direction)
  }

  return axios
    .get(`${process.env.VITE_LOS_URL}/transactions?${params.toString()}`)
    .then((resp) => resp.data)
}

export async function getDexTrades(
  currencyCode: string,
  issuer: string,
  size?: number,
  searchAfter?: any,
  direction?: string,
): Promise<any> {
  try {
    log.info('fetching dex trades data from LOS')
    return fetchTokenTransactions(
      currencyCode,
      issuer,
      'dex-trade',
      size ?? 10,
      searchAfter,
      direction,
    )
  } catch (error) {
    log.error(`Failed to fetch dex trades ${currencyCode}.${issuer}: ${error}`)
    throw error
  }
}

export async function getTransfers(
  currencyCode: string,
  issuer: string,
  size?: number,
  searchAfter?: any,
  direction?: string,
): Promise<any> {
  try {
    log.info('fetching transfers data from LOS')
    return fetchTokenTransactions(
      currencyCode,
      issuer,
      'transfer',
      size ?? 10,
      searchAfter,
      direction,
    )
  } catch (error) {
    log.error(`Failed to fetch transfers ${currencyCode}.${issuer}: ${error}`)
    throw error
  }
}
