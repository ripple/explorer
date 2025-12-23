import type { Transaction, TransactionMetadata } from 'xrpl'
import { transactionTypes } from '../../../containers/shared/components/Transaction'
import { defaultParser } from '../../../containers/shared/components/Transaction/defaultParser'

export interface TransactionSummary {
  hash: string
  ctid: string
  type: string
  result: string
  account: string
  index?: number
  fee?: number
  sequence?: number
  ticketSequence?: number
  isHook?: boolean
  date?: string
  details?: {
    instructions: any
  }
}

const getInstructions = (tx: Transaction, meta: TransactionMetadata) => {
  const type = tx.TransactionType
  const parser = transactionTypes[type]?.parser || defaultParser
  return parser(tx, meta)
}

const summarizeTransaction = (d: any, details = false): TransactionSummary => {
  const summary = {
    hash: d.hash,
    ctid: d.ctid,
    type: d.tx.TransactionType,
    result: d.meta.TransactionResult,
    account: d.tx.Account,
  }
  if (details === false) return summary
  return {
    ...summary,
    index: Number(d.meta.TransactionIndex),
    fee: d.tx.Fee / 1000000,
    sequence: d.tx.Sequence,
    ticketSequence: d.tx.TicketSequence,
    isHook: !!d.tx.EmitDetails,
    date: d.date,
    details: details
      ? {
          instructions: getInstructions(d.tx, d.meta),
        }
      : undefined,
  }
}

export default summarizeTransaction
