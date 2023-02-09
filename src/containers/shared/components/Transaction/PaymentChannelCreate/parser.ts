import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { PaymentChannelCreate } from './types'

const findNode = (meta: any, nodeType: string) => {
  const metaNode = meta.AffectedNodes.find(
    (node: any) =>
      node[nodeType] && node[nodeType].LedgerEntryType === 'PayChannel',
  )
  return metaNode ? metaNode[nodeType] : null
}

export const parser = (tx: PaymentChannelCreate, meta: any) => {
  const st = tx.SourceTag ? `:${tx.SourceTag}` : ''
  const dt = tx.DestinationTag ? `:${tx.DestinationTag}` : ''
  const node = findNode(meta, 'CreatedNode')
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
