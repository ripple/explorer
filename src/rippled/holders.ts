import axios from 'axios'
import logger from './lib/logger'

const log = logger({ name: 'iou' })

export interface TokenHoldersData {
  totalSupply: number
  totalHolders: number
  holders: Array<{
    account: string
    balance: number
    percent: number
  }>
}

const getTokenHoldersInfo = (
  currency: string,
  issuer: string,
  limit: number = 100,
  offset: number = 0,
): Promise<any> =>
  axios
    .get(
      `https://s1.xrplmeta.org/token/${currency}:${issuer}/holders?limit=${limit}&offset=${offset}`,
    )
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.data)
      }

      return resp.data
    })

async function getTokenHolders(
  currencyCode: string,
  issuer: string,
  limit: number = 100,
  offset: number = 0,
  // rippledSocket: ExplorerXrplClient,
): Promise<TokenHoldersData> {
  try {
    log.info('fetching holders data from XRPLMeta')
    return getTokenHoldersInfo(currencyCode, issuer, limit, offset).then(
      (holdersResponse) => holdersResponse as TokenHoldersData,
    )
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}

export default getTokenHolders
