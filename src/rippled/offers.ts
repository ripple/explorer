import logger from './lib/logger'
import { getOffers } from './lib/rippled'
import type { ExplorerXrplClient } from '../containers/shared/SocketContext'

const log = logger({ name: 'offers' })

export interface OrderBook {
  offers: any[]
  averageExchangeRate?: number
  highestExchangeRate?: number
  lowestExchangeRate?: number
}

const getBookOffers = async (
  currencyCode: string,
  issuerAddress: string,
  pairCurrencyCode: string,
  pairIssuerAddress: string,
  rippledSocket: ExplorerXrplClient,
): Promise<OrderBook> => {
  try {
    // log.info('fetching book offers from rippled')
    let orderBook: any = await getOffers(
      rippledSocket,
      currencyCode,
      issuerAddress,
      pairCurrencyCode,
      pairIssuerAddress,
    )
    const { offers } = orderBook
    if (offers.length === 0) {
      return orderBook
    }
    let rateSum = 0
    let highestExchangeRate = 0
    let lowestExchangeRate = Number.MAX_VALUE
    for (const offer of offers) {
      const takerPays = offer.TakerPays.value || offer.TakerPays
      const takerGets = offer.TakerGets.value || offer.TakerGets
      const rate = takerPays / takerGets
      if (rate > highestExchangeRate) {
        highestExchangeRate = rate
      }
      if (rate < lowestExchangeRate) {
        lowestExchangeRate = rate
      }
      rateSum += rate
    }
    const averageExchangeRate = rateSum / offers.length

    offers.sort(
      (offerA: any, offerB: any) =>
        offerA.PreviousTxnLgrSeq - offerB.PreviousTxnLgrSeq,
    )

    orderBook = {
      ...orderBook,
      averageExchangeRate,
      highestExchangeRate,
      lowestExchangeRate,
      offers,
    }

    return orderBook
  } catch (error: any) {
    log.error(error.toString())
    throw error
  }
}

export default getBookOffers
