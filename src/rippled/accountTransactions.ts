import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'

import { formatTransaction } from './lib/utils'
import { getAccountTransactions as getAccountTxs } from './lib/rippled'
import summarize from './lib/txSummary'
import logger from './lib/logger'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'account transactions' })

export interface AccountTransactionsResult {
  transactions: any[]
  marker?: any
}

const getAccountTransactions = async (
  account: string,
  currency: string | undefined,
  marker: any,
  limit: number | undefined,
  rippledSocket: ExplorerXrplClient,
): Promise<AccountTransactionsResult> => {
  // TODO: Retrieve txs for untagged X-address only?

  let classicAddress: string
  let decomposedAddress: {
    classicAddress: string
    tag: number | false
    test: boolean
  } | null = null

  try {
    if (!isValidClassicAddress(account) && !isValidXAddress(account)) {
      throw new Error('Malformed address')
    }

    if (isValidXAddress(account)) {
      decomposedAddress = xAddressToClassicAddress(account)
      ;({ classicAddress } = decomposedAddress)
      // TODO: Display tag, if present
      const isTestnet = decomposedAddress.test

      // TODO: Display tag, if present
      if (
        (isTestnet && process.env.VITE_ENVIRONMENT === 'mainnet') ||
        (!isTestnet &&
          (process.env.VITE_ENVIRONMENT === 'testnet' ||
            process.env.VITE_ENVIRONMENT === 'devnet'))
      ) {
        throw Error('Address on wrong network')
      }
    } else {
      classicAddress = account
    }
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }

  log.info(`get transactions: ${account} -> ${classicAddress}`)
  try {
    const data = await getAccountTxs(
      rippledSocket,
      classicAddress,
      limit,
      marker,
    )
    const transactions = data.transactions
      .map((tx: any) => {
        const txn = formatTransaction(tx)
        return summarize(txn, true)
      })
      .filter((tx: any) => {
        // No filter - return all transactions
        if (!currency) {
          return true
        }

        // Filter by currency (IOU) or MPT issuance ID (passed as currency)
        const txString = JSON.stringify(tx)
        return (
          txString.includes(`"currency":"${currency.toUpperCase()}"`) ||
          txString.includes(`"${currency}"`)
        )
      })
    return {
      transactions,
      marker: data.marker,
    }
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getAccountTransactions
