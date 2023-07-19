import type { Meta } from '../../../types'
import { PaymentChannelClaim, PaymentChannelClaimInstructions } from './types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

const hasRenew = (flags: number): boolean => !!(0x00010000 & flags)
const hasClose = (flags: number) => !!(0x00020000 & flags)

const findNode = (meta: Meta, nodeType: 'DeletedNode' | 'ModifiedNode') => {
  const metaNode = meta.AffectedNodes.find(
    (node: any) =>
      node[nodeType] && node[nodeType].LedgerEntryType === 'PayChannel',
  )
  return metaNode ? metaNode[nodeType] : null
}

const getDetails = (node: any) => {
  const st = node.FinalFields.SourceTag ? `:${node.FinalFields.SourceTag}` : ''
  const dt = node.FinalFields.DestinationTag
    ? `:${node.FinalFields.DestinationTag}`
    : ''
  return {
    source: `${node.FinalFields.Account}${st}`,
    destination: `${node.FinalFields.Destination}${dt}`,
    channel: node.LedgerIndex,
  }
}

export const parser = (
  tx: PaymentChannelClaim,
  meta: Meta,
): PaymentChannelClaimInstructions => {
  let node = findNode(meta, 'ModifiedNode')
  const data: PaymentChannelClaimInstructions = {
    channel: tx.Channel,
    totalClaimed: tx.Balance ? formatAmount(tx.Balance) : undefined,
    renew: hasRenew(tx.Flags || 0) || undefined,
    close: hasClose(tx.Flags || 0) || undefined,
  }

  if (node) {
    const details = getDetails(node)
    const amount = node.FinalFields.Amount
    const total = node.FinalFields.Balance
    const claimed = node.PreviousFields.Balance
      ? total - node.PreviousFields.Balance
      : null
    const remaining = amount - total

    return Object.assign(data, details, {
      channelAmount: formatAmount(amount),
      claimed: claimed ? formatAmount(claimed) : undefined,
      remaining: formatAmount(remaining),
    })
  }

  node = findNode(meta, 'DeletedNode')
  if (node) {
    const details = getDetails(node)
    const returned = node.FinalFields.Amount - node.FinalFields.Balance

    return Object.assign(data, details, {
      channelAmount: formatAmount(node.FinalFields.Amount),
      totalClaimed: formatAmount(node.FinalFields.Balance),
      returned: returned ? formatAmount(returned) : undefined,
      deleted: true,
    })
  }

  return data
}
