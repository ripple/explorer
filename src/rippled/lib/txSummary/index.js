import { transactionTypes } from '../../../containers/shared/components/Transaction'

const PaymentChannelCreate = require('./PaymentChannelCreate')
const PaymentChannelClaim = require('./PaymentChannelClaim')
const PaymentChannelFund = require('./PaymentChannelFund')

const summarize = {
  PaymentChannelCreate,
  PaymentChannelClaim,
  PaymentChannelFund,
}

const getInstructions = (tx, meta) => {
  const type = tx.TransactionType
  // Locate the transaction parser which returns "instructions" to be used in transaction specific components
  // TODO: Remove summarize[type] lookup once all transactions have been moved to the new definition style
  const mappingFn = transactionTypes[type]?.parser
    ? transactionTypes[type]?.parser
    : summarize[type]

  return mappingFn ? mappingFn(tx, meta) : {}
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
