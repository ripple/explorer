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

const getTokenHoldersInfo = (currency, issuer): Promise<any> =>
  axios
    .get(
      `https://s1.xrplmeta.org/token/${currency}:${issuer}/holders?limit=100`,
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
  // rippledSocket: ExplorerXrplClient,
): Promise<TokenHoldersData> {
  try {
    log.info('fetching holders data from XRPLMeta')
    return getTokenHoldersInfo(currencyCode, issuer).then(
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
