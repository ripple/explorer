import { UInt64 } from 'ripple-binary-codec/dist/types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { OracleSet } from './types'

export function parser(tx: OracleSet) {
  const priceDataSeries = tx.PriceDataSeries.map((priceDataObj) => ({
    tradingPair: `${priceDataObj.PriceData.BaseAsset}/${priceDataObj.PriceData.QuoteAsset}`,

    assetPrice:
      priceDataObj.PriceData.AssetPrice && priceDataObj.PriceData.Scale
        ? (
            Number(UInt64.from(priceDataObj.PriceData.AssetPrice).valueOf()) /
            10 ** priceDataObj.PriceData.Scale
          ).toFixed(5)
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
