import axios from 'axios'
import logger from '../../../rippled/lib/logger'
import { LOSToken } from '../../shared/losTypes'

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
const fetchTokenInfo = (currency: string, issuer: string): Promise<any> =>
  axios.get(`${process.env.VITE_LOS_URL}/tokens/${currency}.${issuer}`)

const mapTokenResponse = (response: any): LOSToken => ({
  currency: response.currency,
  issuer_account: response.issuer_account,
  name: response.token_name,
  asset_class: response.asset_class,
  asset_subclass: response.asset_subclass,
  daily_trades: response.number_of_trades,
  icon: response.icon,
  ttl: response.ttl,
  social_links: response.social_links,
  trustlines: response.number_of_trustlines,
  transfer_fee: response.transfer_fee,
  issuer_domain: response.issuer_domain,
  issuer_name: response.issuer_name,
  market_cap: response.market_cap,
  holders: response.number_of_holders,
  daily_volume: response.daily_volume,
  supply: response.supply,
  trust_level: response.trust_level,
  price: response.price,
  index: response.index || -1,
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
