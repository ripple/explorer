import { convertHexToString } from '../../../../../rippled/lib/utils'
import { OracleSet } from './types'
import { convertScaledPrice } from '../../../utils'

export function parser(tx: OracleSet) {
  const priceDataSeries = tx.PriceDataSeries.map((priceDataObj) => ({
    baseAsset: priceDataObj.PriceData.BaseAsset,
    quoteAsset: priceDataObj.PriceData.QuoteAsset,
    assetPrice:
      priceDataObj.PriceData.AssetPrice && priceDataObj.PriceData.Scale
        ? convertScaledPrice(
            priceDataObj.PriceData.AssetPrice,
            priceDataObj.PriceData.Scale,
          )
        : undefined,
  }))

  return {
    oracleDocumentID: tx.OracleDocumentID,
    provider: convertHexToString(tx.Provider),
    uri: convertHexToString(tx.URI),
    lastUpdateTime: tx.LastUpdateTime,
    assetClass: convertHexToString(tx.AssetClass),
    priceDataSeries,
  }
}
