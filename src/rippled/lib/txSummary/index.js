import { transactionTypes } from '../../../containers/shared/components/Transaction'
import { defaultParser } from '../../../containers/shared/components/Transaction/defaultParser'

const getInstructions = (tx, meta) => {
  const type = tx.TransactionType
  const parser = transactionTypes[type]?.parser || defaultParser
  return parser(tx, meta)
}

const summarizeTransaction = (d, details = false) => ({
  hash: d.hash,
  type: d.tx.TransactionType,
  result: d.meta.TransactionResult,
  account: d.tx.Account,
  index: Number(d.meta.TransactionIndex),
  fee: d.tx.Fee / 1000000,
  sequence: d.tx.Sequence,
  ticketSequence: d.tx.TicketSequence,
  date: d.date,
  details: details
    ? {
        instructions: getInstructions(d.tx, d.meta),
      }
    : undefined,
})

export default summarizeTransaction
