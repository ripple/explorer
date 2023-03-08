import { XrplClient } from 'xrpl-client'
import { encodeAccountID } from 'ripple-address-codec'
import { getNFTTransactions as getNFTTxs } from './lib/rippled'
import { formatTransaction } from './lib/utils'
import summarize from './lib/txSummary'
import logger from './lib/logger'

const log = logger({ name: 'NFT transactions' })
export const getNFTTransactions = (
  rippledSocket: XrplClient,
  tokenId: string,
  limit: number,
  marker: string,
) =>
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
    .catch((error) => {
      log.error(error.toString())
      throw error
    })

// Get the oldest NFT tx by having the 'forward' param set to true
export const getOldestNFTTransaction = (
  rippledSocket: XrplClient,
  tokenId: string,
) =>
  getNFTTxs(rippledSocket, tokenId, 1, '', true)
    .then((data) => {
      const transactions = data.transactions.map((tx) => {
        const txn = formatTransaction(tx)
        return summarize(txn, true)
      })
      return {
        transaction: transactions?.length > 0 ? transactions[0] : undefined,
      }
    })
    .catch((error) => {
      log.error(error.toString())
      throw error
    })

export const parseIssuerFromNFTokenID = (
  nftokenID: string,
): string | undefined => {
  const issuerPortion = nftokenID.substring(8, 48)
  if (issuerPortion.length < 20) {
    return undefined
  }
  return encodeAccountID(Buffer.from(nftokenID.substring(8, 48), 'hex'))
}
