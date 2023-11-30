import type { PaymentChannelCreate } from 'xrpl'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { findNode } from '../../../transactionUtils'

export const parser = (tx: PaymentChannelCreate, meta: any) => {
  const st = tx.SourceTag ? `:${tx.SourceTag}` : ''
  const dt = tx.DestinationTag ? `:${tx.DestinationTag}` : ''
  const node = findNode(meta, 'CreatedNode', 'PayChannel')
  return {
    amount: formatAmount(tx.Amount),
    source: `${tx.Account}${st}`,
    destination: `${tx.Destination}${dt}`,
    pubkey: tx.PublicKey,
    delay: tx.SettleDelay,
    cancelAfter: tx.CancelAfter ? convertRippleDate(tx.CancelAfter) : undefined,
    channel: node && node.LedgerIndex,
  }
}
