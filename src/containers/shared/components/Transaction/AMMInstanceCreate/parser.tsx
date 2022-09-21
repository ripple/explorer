import formatAmount from 'rippled/lib/txSummary/formatAmount'

export function parser(tx: any) {
  const amount = formatAmount(tx.Asset1)
  const amount2 = formatAmount(tx.Asset2)

  return {
    amount,
    amount2,
  }
}
