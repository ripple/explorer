import formatAmount from 'rippled/lib/txSummary/formatAmount'
import { getAMMAccountID } from '../../../../MetaParser'

export function parser(tx: any, meta: any) {
  const amount = formatAmount(tx.Amount)
  const amount2 = formatAmount(tx.Amount2)
  const tradingFee = tx.TradingFee
  const accountID = getAMMAccountID(meta)

  return {
    amount,
    amount2,
    tradingFee,
    accountID,
  }
}
