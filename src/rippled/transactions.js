import logger from './lib/logger'
import { formatTransaction } from './lib/utils'
import { getTransaction as getRippledTransaction } from './lib/rippled'
import summarizeTransaction from './lib/txSummary'

const log = logger({ name: 'transactions' })

const getTransaction = (transactionId, rippledSocket) => {
  log.info(`get tx: ${transactionId}`)
  return getRippledTransaction(rippledSocket, transactionId)
    .then((data) => {
      const formattedTransaction = formatTransaction(data)
      return {
        summary: summarizeTransaction(formattedTransaction, true).details,
        processed: formattedTransaction,
        raw: data,
      }
    })
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
}

export default getTransaction
