import type { Batch } from 'xrpl'
import { hashSignedTx } from 'xrpl/dist/npm/utils/hashes/hashLedger'

export function parser(tx: Batch) {
  const batchTransactions = tx.RawTransactions.map((transaction) => ({
    Account: transaction.RawTransaction.Account,
    hash: hashSignedTx(transaction.RawTransaction),
  }))
  const batchSigners = tx.BatchSigners?.map((signer) => ({
    Account: signer.BatchSigner.Account,
  }))
  return { batchTransactions, batchSigners }
}
