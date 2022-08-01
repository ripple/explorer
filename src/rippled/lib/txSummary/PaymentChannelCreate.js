const formatAmount = require('./formatAmount')
const utils = require('../utils')

const findNode = (meta, nodeType) => {
  const metaNode = meta.AffectedNodes.find(
    (node) => node[nodeType] && node[nodeType].LedgerEntryType === 'PayChannel',
  )
  return metaNode ? metaNode[nodeType] : null
}

module.exports = (tx, meta) => {
  const st = tx.SourceTag ? `:${tx.SourceTag}` : ''
  const dt = tx.DestinationTag ? `:${tx.DestinationTag}` : ''
  const node = findNode(meta, 'CreatedNode')
  return {
    amount: formatAmount(tx.Amount),
    source: `${tx.Account}${st}`,
    destination: `${tx.Destination}${dt}`,
    pubkey: tx.PublicKey,
    delay: tx.SettleDelay,
    expiration: tx.Expiration
      ? utils.convertRippleDate(tx.Expiration)
      : undefined,
    cancelAfter: tx.CancelAfter
      ? utils.convertRippleDate(tx.CancelAfter)
      : undefined,
    channel: node && node.LedgerIndex,
  }
}
