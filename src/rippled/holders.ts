import logger from './lib/logger'
import { formatAccountInfo } from './lib/utils'
import { getBalances, getAccountInfo, getServerInfo } from './lib/rippled'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'
import axios from 'axios'
import { LOSToken } from '../containers/shared/losTypes'

const log = logger({ name: 'iou' })

export interface TokenHoldersData {
  totalSupply: number
  totalHolders: number
  holders: Array<{
    account: string
    balance: number
    percent_supply: number
  }>
}

const getTokenHoldersInfo = (currency, issuer): Promise<any> => {
  return axios
    .get(
      `https://s1.xrplmeta.org/token/${currency}:${issuer}/holders?limit=100`,
    )
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.data)
      }

      return resp.data
    })
}

async function getTokenHolders(
  currencyCode: string,
  issuer: string,
  // rippledSocket: ExplorerXrplClient,
): Promise<TokenHoldersData> {
  try {
    // log.info('fetching account info from rippled')
    // const accountInfo = await getAccountInfo(rippledSocket, issuer)
    // const serverInfo = await getServerInfo(rippledSocket)

    log.info('fetching holders data from XRPLMeta')
    return getTokenHoldersInfo(currencyCode, issuer).then((holdersResponse) => {
      return holdersResponse as TokenHoldersData
    })
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}

export default getTokenHolders
