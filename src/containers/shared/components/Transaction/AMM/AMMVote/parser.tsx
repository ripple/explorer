import { getAMMAccountID } from '../../../../MetaParser'

export function parser(tx: any, meta: any) {
  const tradingFee = tx.TradingFee
  const accountID = getAMMAccountID(meta)

  return {
    tradingFee,
    accountID,
  }
}
