import { getNFTTransactions as getNFTTxs } from './lib/rippled'
import { formatTransaction } from './lib/utils'
import summarize from './lib/txSummary'
import logger from './lib/logger'

const log = logger({ name: 'NFT transactions' })
export const getNFTTransactions = (rippledSocket, tokenId, limit, marker) =>
  getNFTTxs(rippledSocket, tokenId, limit, marker, undefined)
    .then((data) => {
      const transactions = data.transactions.map((tx) => {
        const txn = formatTransaction(tx)
        return summarize(txn, true)
      })

      return {
        transactions,
        marker: data.marker,
      }
    })
    .then((d) => d)
    .catch((error) => {
      log.error(error.toString())
      throw error
    })

export const getOldestNFTTransaction = (rippledSocket, tokenId) =>
  getNFTTxs(rippledSocket, tokenId, 1, '', true)
    .then((data) => {
      const transactions = data.transactions.map((tx) => {
        const txn = formatTransaction(tx)
        return summarize(txn, true)
      })
      return {
        transaction:
          transactions && transactions.length > 0 ? transactions[0] : undefined,
      }
    })
    .then((d) => d)
    .catch((error) => {
      log.error(error.toString())
      throw error
    })
