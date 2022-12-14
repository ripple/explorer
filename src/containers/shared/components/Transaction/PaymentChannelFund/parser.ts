import { PaymentChannelFund, PaymentChannelFundInstructions } from './types'
import { Meta } from '../../../transactionUtils'

import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

const findNode = (meta: Meta, nodeType: 'DeletedNode' | 'ModifiedNode') => {
  const metaNode = meta.AffectedNodes.find(
    (node) => node[nodeType] && node[nodeType].LedgerEntryType === 'PayChannel',
  )
  return metaNode ? metaNode[nodeType] : null
}

const getDetails = (node: any): PaymentChannelFundInstructions => {
  const st = node.FinalFields.SourceTag ? `:${node.FinalFields.SourceTag}` : ''
  const dt = node.FinalFields.DestinationTag
    ? `:${node.FinalFields.DestinationTag}`
    : ''
  return {
    source: `${node.FinalFields.Account}${st}`,
    destination: `${node.FinalFields.Destination}${dt}`,
  }
}

export const parser = (
  tx: PaymentChannelFund,
  meta: Meta,
): PaymentChannelFundInstructions => {
  const node = findNode(meta, 'ModifiedNode')
  const channel = {
    ...(node && getDetails(node)),
    channel: tx.Channel,
  }
  channel.increase = formatAmount(tx.Amount)

  if (node) {
    channel.channelAmount = formatAmount(node.FinalFields.Amount)
    channel.totalClaimed = formatAmount(node.FinalFields.Balance)
  }

  return channel
}
