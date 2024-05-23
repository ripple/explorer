import { convertHexToString } from '../../../../../rippled/lib/utils'
import { OracleSet } from './types'

export function convertScaledPrice(assetPrice: string, scale: number) {
  const scaledPriceInBigInt = BigInt(`0x${assetPrice}`)
  const divisor = BigInt(10 ** scale)
  const integerPart = scaledPriceInBigInt / divisor
  const remainder = scaledPriceInBigInt % divisor
  const fractionalPart = (remainder * BigInt(10 ** scale)) / divisor
  return fractionalPart > 0
    ? `${integerPart}.${fractionalPart.toString().padStart(scale, '0')}`
    : `${integerPart}`
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
