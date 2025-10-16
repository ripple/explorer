import axios from 'axios'
import logger from '../../../rippled/lib/logger'

const log = logger({ name: 'iou-tokenTx' })

export interface TransfersData {}

export interface DexTradesData {}

const getTokenTx = (
  currency: string,
  issuer: string,
  transactionType: string,
  from: number = 0,
  size: number = 10,
): Promise<any> => {
  const params = new URLSearchParams({
    token: `${currency}.${issuer}`,
    transactionType,
    from: from.toString(),
    size: size.toString(),
  })

  return axios
    .get(`${process.env.VITE_LOS_URL}/transactions?${params.toString()}`)
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.data)
      }

      console.log('Token Tx response:', resp.data)

      return resp.data
    })
}

export async function getDexTrades(
  currencyCode: string,
  issuer: string,
  from: number = 0,
  size: number = 10,
): Promise<any> {
  try {
    log.info('fetching dex trades data from LOS')
    return getTokenTx(currencyCode, issuer, 'dex-trade', from, size).then(
      (dexTradesResponse) => dexTradesResponse as any,
    )
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
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
    return getTokenTx(currencyCode, issuer, 'transfer', from, size).then(
      (transfersResponse) => transfersResponse as any,
    )
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}
