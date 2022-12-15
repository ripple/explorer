import summarizeTransaction from './txSummary'
import { convertRippleDate } from './convertRippleDate'
import { formatTransaction, XRP_BASE } from './utils'

const summarizeLedger = (ledger, txDetails = false) => {
  const summary = {
    ledger_index: Number(ledger.ledger_index),
    ledger_hash: ledger.ledger_hash,
    parent_hash: ledger.parent_hash,
    close_time: convertRippleDate(ledger.close_time),
    total_xrp: ledger.total_coins / XRP_BASE,
    total_fees: 0,
    transactions: [],
  }

  ledger.transactions.forEach((tx) => {
    const d = formatTransaction(tx)
    summary.total_fees += Number(tx.Fee)
    summary.transactions.push(summarizeTransaction(d, txDetails))
  })

  summary.transactions.sort((a, b) => a.index - b.index)
  Object.assign(summary, { total_fees: summary.total_fees / XRP_BASE })
  return summary
}

export { summarizeLedger }
