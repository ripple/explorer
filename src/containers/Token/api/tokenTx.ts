import axios from 'axios'
import logger from '../../../rippled/lib/logger'

const log = logger({ name: 'iou-tokenTx' })

const fetchTokenTransactions = (
  currency: string,
  issuer: string,
  transactionType: string,
  from: number,
  size: number,
): Promise<any> => {
  const params = new URLSearchParams({
    token: `${currency}.${issuer}`,
    transactionType,
    from: from.toString(),
    size: size.toString(),
  })

  return axios
    .get(`${process.env.VITE_LOS_URL}/transactions?${params.toString()}`)
    .then((resp) => resp.data)
}

export async function getDexTrades(
  currencyCode: string,
  issuer: string,
  from: number = 0,
  size: number = 10,
): Promise<any> {
  try {
    log.info('fetching dex trades data from LOS')
    return fetchTokenTransactions(currencyCode, issuer, 'dex-trade', from, size)
  } catch (error) {
    log.error(`Failed to fetch dex trades ${currencyCode}.${issuer}: ${error}`)
    throw error
  }
}

export async function getTransfers(
  currencyCode: string,
  issuer: string,
  from: number = 0,
  size: number = 10,
): Promise<any> {
  try {
    log.info('fetching transfers data from LOS')
    return fetchTokenTransactions(currencyCode, issuer, 'transfer', from, size)
  } catch (error) {
    log.error(`Failed to fetch transfers ${currencyCode}.${issuer}: ${error}`)
    throw error
  }
}
