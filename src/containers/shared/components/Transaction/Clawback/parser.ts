import { Clawback, ClawbackInstructions } from './types'
import { TransactionParser } from '../types'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser: TransactionParser<Clawback, ClawbackInstructions> = (
  tx,
) => {
  const account = tx.Account
  const amount = formatAmount(tx.Amount)
  const holder = amount.issuer
  amount.issuer = account

  return {
    account,
    amount,
    holder,
  }
}
