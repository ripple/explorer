import axios from 'axios'
import logger from '../../../rippled/lib/logger'

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

const fetchTokenHoldersInfo = (
  currency: string,
  issuer: string,
  limit: number,
  offset: number,
): Promise<TokenHoldersData> =>
  axios
    .get(
      `https://s1.xrplmeta.org/token/${currency}:${issuer}/holders?limit=${limit}&offset=${offset}`,
    )
    .then((resp) => resp.data)

async function getTokenHolders(
  currencyCode: string,
  issuer: string,
  limit: number = 100,
  offset: number = 0,
): Promise<TokenHoldersData> {
  try {
    log.info('fetching holders data from XRPLMeta')
    return fetchTokenHoldersInfo(currencyCode, issuer, limit, offset)
  } catch (error) {
    log.error(
      `Failed to fetch token holders ${currencyCode}.${issuer}: ${error}`,
    )
    throw error
  }
}

export default getTokenHolders
