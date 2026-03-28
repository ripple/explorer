import axios from 'axios'
import type { ExplorerXrplClient } from '../shared/SocketContext'
import { AMMPoolLOSData } from './types'

const LOS_URL = process.env.VITE_LOS_URL

/** Fetch AMM pool market data from LOS (mainnet only) */
export const fetchAMMPoolData = async (
  ammAccountId: string,
): Promise<AMMPoolLOSData> => {
  const response = await axios.get(`${LOS_URL}/amms/${ammAccountId}`)
  return response.data
}

/** Fetch historical trends for a specific AMM pool from LOS */
export const fetchAMMHistoricalTrends = async (
  ammAccountId: string,
  timeRange: string = '6M',
): Promise<any> => {
  const response = await axios.get(`${LOS_URL}/amms/historical-trends`, {
    params: {
      amm_account_id: ammAccountId,
      time_range: timeRange,
    },
  })
  return response.data
}

/** Fetch DEX trades for an AMM pool from LOS */
export const fetchAMMDexTrades = async (
  ammAccountId: string,
  size?: number,
  searchAfter?: any,
  direction?: string,
  sortField?: string,
  sortOrder?: string,
): Promise<any> => {
  const params = new URLSearchParams({
    account: ammAccountId,
    size: (size ?? 100).toString(),
    type: 'amm',
  })
  if (searchAfter) params.append('search_after', JSON.stringify(searchAfter))
  if (direction) params.append('direction', direction)
  if (sortField) params.append('sort_field', sortField)
  if (sortOrder) params.append('sort_order', sortOrder)

  const response = await axios.get(`${LOS_URL}/dex-trades?${params.toString()}`)
  return response.data
}

/** Fetch AMMDeposit or AMMWithdraw transactions from LOS */
export const fetchAMMTransactions = async (
  ammAccountId: string,
  type: 'AMMDeposit' | 'AMMWithdraw',
  size?: number,
  searchAfter?: any,
  direction?: string,
): Promise<any> => {
  const params = new URLSearchParams({
    account: ammAccountId,
    type,
    size: (size ?? 100).toString(),
  })
  if (searchAfter) params.append('search_after', JSON.stringify(searchAfter))
  if (direction) params.append('direction', direction)

  const response = await axios.get(
    `${LOS_URL}/v2/transactions?${params.toString()}`,
  )
  return response.data
}

/**
 * Fetch the creation timestamp of an AMM pool.
 * Gets the first transaction (AMMCreate) via account_tx with forward=true.
 */
export const fetchAMMCreatedTimestamp = async (
  rippledSocket: ExplorerXrplClient,
  ammAccountId: string,
): Promise<number | null> => {
  const resp = await rippledSocket.send({
    command: 'account_tx',
    account: ammAccountId,
    limit: 1,
    forward: true,
    ledger_index_min: -1,
    ledger_index_max: -1,
  })
  if (resp?.transactions?.[0]?.tx) {
    return resp.transactions[0].tx.date
  }
  return null
}
