import logger from './lib/logger'
import { formatTransaction } from './lib/utils'
import { getTransaction as getRippledTransaction } from './lib/rippled'
import summarizeTransaction from './lib/txSummary'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'transactions' })

export interface TransactionData {
  summary: any
  processed: any
  raw: any
}

const getTransaction = async (
  transactionId: string,
  rippledSocket: ExplorerXrplClient,
): Promise<TransactionData> => {
  log.info(`get tx: ${transactionId}`)
  try {
    const data = await getRippledTransaction(rippledSocket, transactionId)
    const formattedTransaction = formatTransaction(data)
    return {
      summary: summarizeTransaction(formattedTransaction, true).details,
      processed: formattedTransaction,
      raw: data,
    }
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getTransaction
