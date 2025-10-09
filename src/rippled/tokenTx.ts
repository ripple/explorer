import axios from 'axios'
import logger from './lib/logger'

const log = logger({ name: 'iou-tokenTx' })

export interface TransfersData {}

export interface DexTradesData {}

const getTokenTx = (currency, issuer, transactionType): Promise<any> =>
  axios
    .get(
      `${process.env.VITE_LOS_URL}/transactions?token=${currency}.${issuer}&transactionType=${transactionType}&size=20`,
    )
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.data)
      }

      console.log('Token Tx response:', resp.data)

      return resp.data
    })

export async function getDexTrades(
  currencyCode: string,
  issuer: string,
): Promise<any> {
  try {
    log.info('fetching dex trades data from LOS')
    return getTokenTx(currencyCode, issuer, 'dex-trade').then(
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
): Promise<any> {
  try {
    log.info('fetching transfers data from LOS')
    return getTokenTx(currencyCode, issuer, 'transfers').then(
      (transfersResponse) => transfersResponse as any,
    )
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}
