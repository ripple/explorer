import summarizeTransaction from './txSummary'
import { convertRippleDate } from './convertRippleDate'
import { formatTransaction, XRP_BASE } from './utils'

interface LedgerSummary {
  ledger_index: number
  ledger_time: number
  ledger_hash: string
  parent_hash: string
  close_time: number
  total_xrp: number
  total_fees: number
  transactions: any[]
}

const summarizeLedger = (ledger: any, txDetails: boolean = false) => {
  const transactions = ledger.transactions.map((tx: any) => {
    const d = formatTransaction(tx)
    return summarizeTransaction(d, txDetails)
  })

  // eslint-disable-next-line camelcase -- TODO: fix later
  const total_fees =
    ledger.transactions.reduce(
      (sum: number, tx: any) => sum + Number(tx.Fee),
      0,
    ) / XRP_BASE

  const summary: LedgerSummary = {
    ledger_index: Number(ledger.ledger_index),
    ledger_time: ledger.close_time,
    ledger_hash: ledger.ledger_hash,
    parent_hash: ledger.parent_hash,
    close_time: convertRippleDate(ledger.close_time),
    total_xrp: ledger.total_coins / XRP_BASE,
    // eslint-disable-next-line camelcase -- TODO: fix later
    total_fees,
    transactions: transactions.sort((a: any, b: any) => a.index - b.index),
  }

  return summary
}

export { summarizeLedger }
