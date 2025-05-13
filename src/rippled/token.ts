import logger from './lib/logger'
import { formatAccountInfo } from './lib/utils'
import { getBalances, getAccountInfo, getServerInfo } from './lib/rippled'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'iou' })

export interface TokenData {
  balance: string
  reserve: number
  sequence: number
  rate?: number
  obligations?: string
  domain?: string
  emailHash?: string
  previousLedger: number
  previousTxn: string
  flags: string[]
}

async function getToken(
  currencyCode: string,
  issuer: string,
  rippledSocket: ExplorerXrplClient,
): Promise<TokenData> {
  try {
    log.info('fetching account info from rippled')
    const accountInfo = await getAccountInfo(rippledSocket, issuer)
    const serverInfo = await getServerInfo(rippledSocket)

    log.info('fetching gateway_balances from rippled')
    const balances = await getBalances(rippledSocket, issuer)
    const obligations =
      balances?.obligations && balances.obligations[currencyCode.toUpperCase()]
    if (!obligations) {
      throw new Error('Currency not issued by account')
    }

    const {
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      previousTxn,
      previousLedger,
    } = formatAccountInfo(accountInfo, serverInfo.info.validated_ledger)

    return {
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      obligations,
      previousTxn,
      previousLedger,
    }
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}

export default getToken
