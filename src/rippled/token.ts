import axios from 'axios'
import logger from './lib/logger'
import { LOSToken } from '../containers/shared/losTypes'

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

const getLOSTokenInfo = (currency, issuer): Promise<any> =>
  axios
    // .get(`${process.env.VITE_LOS_URL}/tokens/${currency}.${issuer}`)
    .get(`https://los.prod.ripplex.io/tokens/${currency}.${issuer}`) // TEMP FOR DEV TEST
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.data)
      }

      return resp.data
    })

async function getToken(
  currencyCode: string,
  issuer: string,
): Promise<LOSToken> {
  try {
    log.info('fetching token data from LOS')
    return getLOSTokenInfo(currencyCode, issuer).then((tokenResponse) => {
      const losToken: LOSToken = {
        currency: tokenResponse.currency,
        issuer_account: tokenResponse.issuer_account,
        name: tokenResponse.token_name,
        asset_class: tokenResponse.asset_class,
        asset_subclass: tokenResponse.asset_subclass,
        daily_trades: tokenResponse.number_of_trades,
        icon: tokenResponse.icon,
        ttl: tokenResponse.ttl,
        social_links: tokenResponse.social_links,
        trustlines: tokenResponse.number_of_trustlines,
        transfer_fee: tokenResponse.transfer_fee,
        issuer_domain: tokenResponse.issuer_domain,
        issuer_name: tokenResponse.issuer_name,
        market_cap: tokenResponse.market_cap,
        holders: tokenResponse.number_of_holders,
        daily_volume: tokenResponse.daily_volume,
        supply: tokenResponse.supply,
        trust_level: tokenResponse.trust_level,
        price: tokenResponse.price,
        index: tokenResponse.index || -1,
      }
      return losToken
    })
  } catch (error) {
    if (error) {
      log.error(error.toString())
    }
    throw error
  }
}

export default getToken
