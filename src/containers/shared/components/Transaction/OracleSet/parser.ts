import { convertHexToString } from '../../../../../rippled/lib/utils'
import { OracleSet } from './types'

export function parser(tx: OracleSet) {
  const priceDataSeries = tx.PriceDataSeries.map((priceDataObj) => ({
    tradingPair: `${priceDataObj.PriceData.BaseAsset}/${priceDataObj.PriceData.QuoteAsset}`,

    assetPrice:
      priceDataObj.PriceData.AssetPrice && priceDataObj.PriceData.Scale
        ? Number(
            (BigInt(`0x${priceDataObj.PriceData.AssetPrice}`) * 100000n) /
              BigInt(10 ** priceDataObj.PriceData.Scale),
          ) / 100000
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
