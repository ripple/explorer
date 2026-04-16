import { DexTradeFormatted } from './DexTradeTable'

/** Raw DEX trade as returned by LOS /dex-trades API */
export interface LOSDexTradeRaw {
  tx_hash: string
  ledger_index: number
  timestamp: number
  from: string
  to: string
  type?: string
  subtype?: string
  amount_in: { currency: string; issuer?: string; value: string }
  amount_out: { currency: string; issuer?: string; value: string }
}

/** Transform a raw LOS dex trade into the format consumed by DexTradeTable. */
export const formatDexTrade = (trade: LOSDexTradeRaw): DexTradeFormatted => ({
  hash: trade.tx_hash,
  ledger: trade.ledger_index,
  timestamp: trade.timestamp,
  from: trade.from,
  to: trade.to,
  type: trade.type,
  subtype: trade.subtype,
  amount_in: {
    currency: trade.amount_in.currency,
    issuer: trade.amount_in.issuer,
    amount: Number(trade.amount_in.value),
  },
  amount_out: {
    currency: trade.amount_out.currency,
    issuer: trade.amount_out.issuer,
    amount: Number(trade.amount_out.value),
  },
  rate:
    trade.amount_in && Number(trade.amount_in.value) !== 0
      ? Number(trade.amount_out.value) / Number(trade.amount_in.value)
      : null,
})
