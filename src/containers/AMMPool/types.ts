import { ExplorerAmount } from '../shared/types'

/** LOS /amms/{id} response */
export interface LOSAMMPoolData {
  tvl_xrp: number
  tvl_usd: number
  trading_volume_xrp: number
  trading_volume_usd: number
  fees_collected_xrp: number
  fees_collected_usd: number
  annual_percentage_return: number
  liquidity_provider_count: number
  issuer_1: string | null
  currency_1: string
  issuer_2: string | null
  currency_2: string
  last_updated_timestamp: string
}

/** Single data point from LOS /amms/historical-trends response */
export interface HistoricalDataPoint {
  date: string
  tvl_usd: number
  tvl_xrp: number
  trading_volume_usd: number
  trading_volume_xrp: number
}

/** LOS /amms/historical-trends response */
export interface HistoricalTrendsResponse {
  data_points: HistoricalDataPoint[]
}

/** Raw AMMDeposit/AMMWithdraw transaction as returned by LOS /v2/transactions API */
export interface LOSAMMDepositWithdrawRaw {
  hash: string
  ledger_index: number
  timestamp: number
  account: string
  amm?: {
    asset1?: { currency: string; issuer?: string | null; value: string }
    asset2?: { currency: string; issuer?: string | null; value: string }
    lp_tokens_received?: string
    lp_tokens_redeemed?: string
    value_usd?: number
  }
}

/** LOS cursor: [timestamp, tx_hash] */
export type LOSCursor = [number, string]

/** Cursor-paginated response from LOS API endpoints */
export interface LOSCursorResponse<T = any> {
  results: T[]
  next_cursor?: LOSCursor
  prev_cursor?: LOSCursor
}

/** Auction slot data from amm_info response */
export interface AuctionSlot {
  account?: string
  expiration?: string | number
  discounted_fee?: number
  price?: { value: string; currency: string; issuer?: string }
  time_interval?: number
}

/** Formatted balance from amm_info (via formatAmount) */
export interface FormattedBalance {
  currency: string
  amount: string | number
  issuer?: string
}

/** Formatted AMMDeposit/AMMWithdraw transaction for table display */
export interface AMMDepositWithdrawFormatted {
  hash: string
  ledger: number
  timestamp: number
  account: string
  asset: ExplorerAmount | null
  asset2: ExplorerAmount | null
  lpTokens: string | null
  valueUsd: number | null
}
