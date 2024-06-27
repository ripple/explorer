import type { BaseTransaction } from 'xrpl'

// TODO: get type from xrpl.js once it's been added there
export interface OracleSet extends BaseTransaction {
  TransactionType: 'OracleSet'
  OracleDocumentID: number
  Provider?: string
  URI?: string
  LastUpdateTime: number
  AssetClass?: string
  PriceDataSeries: Array<{
    PriceData: PriceData
  }>
}

interface PriceData {
  BaseAsset: string
  QuoteAsset: string
  AssetPrice?: string
  Scale?: number
}
