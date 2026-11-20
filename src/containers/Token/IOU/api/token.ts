import axios, { AxiosError } from 'axios'
import logger from '../../../../rippled/lib/logger'
import { LOSToken } from '../../../shared/losTypes'

const log = logger({ name: 'iou-token' })

export interface TokenData {
  balance: string
  reserve: number
  sequence: number
  rate?: string
  obligations?: string
  domain?: string
  emailHash?: string
  previousLedger: number
  previousTxn: string
  flags: string[]
}
const MAX_TOKEN_RETRIES = 3

/**
 * react-query `retry` for the token query: retries LOS throttling (429) and
 * network errors, which is how a 429 shows up when the browser hides it. A
 * 404 or 400 is a real answer, so it isn't retried. Backoff is react-query's
 * default (1s, 2s, 4s).
 */
export const shouldRetryTokenFetch = (
  failureCount: number,
  error: unknown,
): boolean => {
  // not axios.isAxiosError: it checks this same flag, but is undefined under jest.mock('axios')
  const axiosError = error as AxiosError | undefined
  if (failureCount >= MAX_TOKEN_RETRIES || !axiosError?.isAxiosError) {
    return false
  }
  return !axiosError.response || axiosError.response.status === 429
}

const fetchTokenInfo = (currency: string, issuer: string): Promise<any> =>
  axios.get(`${process.env.VITE_LOS_URL}/tokens/${currency}.${issuer}`)

const mapTokenResponse = (response: any): LOSToken => ({
  currency: response.currency,
  issuer_account: response.issuer_account,
  name: response.token_name || undefined,
  asset_class: response.asset_class,
  asset_subclass: response.asset_subclass,
  daily_trades: response.number_of_trades
    ? String(response.number_of_trades)
    : undefined,
  icon: response.icon,
  ttl: response.ttl,
  social_links: response.social_links,
  trustlines: response.number_of_trustlines || undefined,
  transfer_fee: response.transfer_fee,
  issuer_domain: response.issuer_domain,
  issuer_name: response.issuer_name,
  market_cap: response.market_cap,
  market_cap_usd: response.market_cap_usd,
  holders: response.number_of_holders || undefined,
  daily_volume: response.daily_volume,
  supply: response.supply,
  trust_level: response.trust_level,
  price: response.price,
  tvl_usd: response.tvl_usd,
  index: response.index ?? -1,
  circ_supply: response.circ_supply,
})

async function getToken(
  currencyCode: string,
  issuer: string,
): Promise<LOSToken> {
  try {
    log.info('fetching token data from LOS')
    const response = await fetchTokenInfo(currencyCode, issuer)
    return mapTokenResponse(response.data)
  } catch (error) {
    log.error(`Failed to fetch token ${currencyCode}.${issuer}: ${error}`)
    throw error
  }
}

export default getToken
