import { Clawback, ClawbackInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { computeBalanceChange } from '../../../../Transactions/Meta/RippleState'

export const parser: TransactionParser<Clawback, ClawbackInstructions> = (
  tx,
  meta,
) => {
  const account = tx.Account
  const amount = formatAmount(tx.Amount)
  const holder = amount.issuer
  amount.issuer = account

  // At this point, we need to get the ACTUAL balance change as a
  // result of Clawback. If the issuer tries to claw back more than
  // what holder has, only the max available balance is clawed.
  const trustlineNode = meta.AffectedNodes.filter(
    (node: any) =>
      node.DeletedNode?.LedgerEntryType === 'RippleState' ||
      node.ModifiedNode?.LedgerEntryType === 'RippleState',
  )

  if (!trustlineNode || trustlineNode.length !== 1)
    return {
      account,
      holder,
    }

  const { change } = computeBalanceChange(
    trustlineNode[0].ModifiedNode ?? trustlineNode[0].DeletedNode,
  )

  amount.amount = Math.abs(change)

  return {
    account,
    amount,
    holder,
  }
}
