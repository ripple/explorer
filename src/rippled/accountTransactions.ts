import {
  isValidClassicAddress,
  isValidXAddress,
  xAddressToClassicAddress,
} from 'ripple-address-codec'

import { formatTransaction } from './lib/utils'
import {
  getAccountTransactions as getAccountTxs,
  getTransaction,
} from './lib/rippled'
import summarize from './lib/txSummary'
import logger from './lib/logger'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'account transactions' })

export interface AccountTransactionsResult {
  transactions: any[]
  marker?: any
}

// Clio's MPT filter returns a Batch's inner transactions but not the Batch
// itself, so add each parent Batch after its last inner transaction
const withParentBatches = async (
  rippledSocket: ExplorerXrplClient,
  transactions: any[],
): Promise<any[]> => {
  const parentIds = [
    ...new Set(
      transactions.map((tx) => tx.meta?.ParentBatchID).filter(Boolean),
    ),
  ]
  const parents = new Map<string, any>(
    await Promise.all(
      parentIds.map(async (id): Promise<[string, any]> => [
        id,
        await getTransaction(rippledSocket, id).catch(() => undefined),
      ]),
    ),
  )
  return transactions.flatMap((tx, index) => {
    const parentId = tx.meta?.ParentBatchID
    const isLastInner =
      parentId && transactions[index + 1]?.meta?.ParentBatchID !== parentId
    const parent = isLastInner && parents.get(parentId)
    return parent ? [tx, parent] : [tx]
  })
}

const getAccountTransactions = async (
  account: string,
  currency: string | undefined,
  marker: any,
  limit: number | undefined,
  rippledSocket: ExplorerXrplClient,
  useP2P: boolean = false,
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
      useP2P,
      // Only the MPT page reads from the P2P host, so currency is an MPT ID
      useP2P ? currency : undefined,
    )
    // Nothing older than an MPT's creation can reference it, so stop paging there
    const reachedMPTCreation =
      !!currency &&
      data.transactions.some(
        (tx: any) =>
          tx.meta?.mpt_issuance_id?.toUpperCase() === currency.toUpperCase(),
      )
    // Clio also matches through metadata (e.g. Vault and LoanBroker
    // transactions), which the summary doesn't keep, so don't filter again
    const rows = data.filtered
      ? await withParentBatches(rippledSocket, data.transactions)
      : data.transactions
    // Filter by currency (IOU) or MPT issuance ID (passed as currency)
    const mentionsToken = (value: any) => {
      const text = JSON.stringify(value)
      return (
        text.includes(`"currency":"${currency?.toUpperCase()}"`) ||
        text.includes(`"${currency}"`)
      )
    }
    const transactions = rows
      .map((tx: any) => {
        const txn = formatTransaction(tx)
        return { txn, summary: summarize(txn, true) }
      })
      .filter(({ txn, summary }: any) => {
        // No filter - return all transactions
        if (!currency || data.filtered) {
          return true
        }

        // A Batch's summary keeps only its inner hashes, so check the inner
        // transactions themselves
        return (
          mentionsToken(summary) ||
          (txn.tx?.TransactionType === 'Batch' &&
            mentionsToken(txn.tx.RawTransactions))
        )
      })
      .map(({ summary }: any) => summary)
    return {
      transactions,
      marker: reachedMPTCreation ? undefined : data.marker,
    }
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getAccountTransactions
