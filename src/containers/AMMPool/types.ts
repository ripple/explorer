import { ExplorerAmount } from '../shared/types'

/** LOS /amms/{id} response */
export interface AMMPoolLOSData {
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

/** Formatted balance from amm_info (via formatAmount) */
export interface FormattedBalance {
  currency: string
  amount: string | number
  issuer?: string
}

/** AMMDeposit/AMMWithdraw transaction from LOS /v2/transactions */
export interface AMMDepositWithdrawTx {
  hash: string
  ledger: number
  timestamp: number
  account: string
  asset: ExplorerAmount | null
  asset2: ExplorerAmount | null
  lpTokens: string | null
  valueUsd: number | null
}
