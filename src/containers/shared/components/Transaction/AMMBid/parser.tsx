import formatAmount from 'rippled/lib/txSummary/formatAmount'

export function parser(tx: any) {
  const amount = formatAmount(tx.Asset1)
  const amount2 = formatAmount(tx.Asset2)
  const fee = tx.Fee
  const price = tx.MinSlotPrice

  return {
    fee,
    amount,
    amount2,
    price,
  }
}
