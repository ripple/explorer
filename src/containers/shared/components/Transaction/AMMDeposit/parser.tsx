import formatAmount from 'rippled/lib/txSummary/formatAmount'

export function parser(tx: any) {
  const amount = formatAmount(tx.Asset1In)
  const amount2 = formatAmount(tx.Asset2In)

  return {
    amount,
    amount2,
  }
}
