import type { Batch } from 'xrpl'

export function parser(tx: Batch) {
  const ledgerIndex = tx.ledger_index
  const account = tx.Account
  const batchTransactions = tx.RawTransactions.map((transaction) => ({
    Account: transaction.RawTransaction.Account,
    TransactionType: transaction.RawTransaction.TransactionType,
    Sequence: transaction.RawTransaction.Sequence,
  }))
  const batchSigners = tx.BatchSigners?.map((signer) => ({
    Account: signer.BatchSigner.Account,
  }))
  return { batchTransactions, batchSigners, ledgerIndex, account }
}
