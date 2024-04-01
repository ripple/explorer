import { Clawback, ClawbackInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { computeBalanceChange } from '../../../utils'

export const parser: TransactionParser<Clawback, ClawbackInstructions> = (
  tx,
  meta,
) => {
  const account = tx.Account
  const amount = formatAmount(tx.Amount)

  if (amount.isMPT === true) {
    const holder = tx.MPTokenHolder

    const filteredMptNode = meta.AffectedNodes.filter(
      (node: any) => node.ModifiedNode?.LedgerEntryType === 'MPToken',
    )

    // If no mpt is modified, it means the tx failed.
    // We just return the amount that was attempted to claw.
    if (!filteredMptNode || filteredMptNode.length !== 1)
      return {
        amount,
        account,
        holder,
      }

    const mptNode = filteredMptNode[0].ModifiedNode
    const prevAmount = mptNode.PreviousFields.MPTAmount ?? '0'
    const finalAmount = mptNode.FinalFields.MPTAmount ?? '0'

    const change = BigInt('0x' + finalAmount) - BigInt('0x' + prevAmount)
    amount.amount =
      change < 0 ? BigInt(-change).toString(10) : BigInt(change).toString(10)

    return {
      account,
      amount,
      holder,
    }
  }

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

  // If no trustline is modified, it means the tx failed.
  // We just return the amount that was attempted to claw.
  if (!trustlineNode || trustlineNode.length !== 1)
    return {
      amount,
      account,
      holder,
    }

  const { change } = computeBalanceChange(
    trustlineNode[0].ModifiedNode ?? trustlineNode[0].DeletedNode,
  )

  // Update the amount that was actually clawed back
  // (could be different from what was submitted)
  amount.amount = Math.abs(change)

  return {
    account,
    amount,
    holder,
  }
}
