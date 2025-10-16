import { LOSToken } from '../../shared/losTypes'
import { TokenHoldersData } from '../api/holders'

export interface TokenPageProps {
  accountId: string
}

export interface TokenHeaderProps {
  currency: string
  tokenData: LOSToken
  xrpUSDRate: string
  holdersData: TokenHoldersData | undefined
  isHoldersDataLoading: boolean
  ammTvlData: number | undefined
  isAmmTvlLoading: boolean
}

export interface OverviewData {
  issuer: string
  price: string
  holders: number
  trustlines: number
  transfer_fee: number
  reputation_level: number
}

export interface MarketData {
  supply: string
  circ_supply: string
  market_cap: string
  volume_24h: string
  trades_24h: string
  amm_tvl: string
}

export interface HeaderBoxesProps {
  overviewData: OverviewData
  marketData: MarketData
  isHoldersDataLoading: boolean
  isAmmTvlLoading: boolean
}

export interface TokenTransactionsTableProps {
  accountId: string
  currency: string
  holdersData?: TokenHoldersData
  isHoldersDataLoading: boolean
  holdersPage: number
  holdersPageSize: number
  setHoldersPage: (page: number) => void
  transfersPage: number
  transfersPageSize: number
  setTransfersPage: (page: number) => void
  dexTradesPage: number
  dexTradesPageSize: number
  setDexTradesPage: (page: number) => void
  transfers: any
  isTransfersLoading: boolean
  dexTrades: any
  tokenData: LOSToken
  XRPUSDPrice: number
}

// Constants
export const TOKEN_PAGE_CONSTANTS = {
  HOLDERS_PAGE_SIZE: 10,
  TRANSFERS_PAGE_SIZE: 10,
  DEX_TRADES_PAGE_SIZE: 10,
  FETCH_INTERVAL_MILLIS: 30000,
} as const

export const ERROR_MESSAGES = {
  default: 'token_page.error_default',
  [404]: 'token_page.error_not_found',
  [400]: 'token_page.error_bad_request',
} as const
