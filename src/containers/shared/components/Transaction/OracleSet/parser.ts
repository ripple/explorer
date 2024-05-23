import { convertHexToString } from '../../../../../rippled/lib/utils'
import { OracleSet } from './types'

export function convertScaledPrice(assetPrice: string, scale: number) {
  return (
    Number(
      (BigInt(`0x${assetPrice}`) * BigInt(10 ** scale)) / BigInt(10 ** scale),
    ) /
    10 ** scale
  )
}

export function parser(tx: OracleSet) {
  const priceDataSeries = tx.PriceDataSeries.map((priceDataObj) => ({
    tradingPair: `${priceDataObj.PriceData.BaseAsset}/${priceDataObj.PriceData.QuoteAsset}`,

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
