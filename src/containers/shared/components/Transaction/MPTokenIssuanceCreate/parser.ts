
import { MPTokenIssuanceCreate, MPTokenIssuanceCreateInstructions } from './types'
import { TransactionParser } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const parser: TransactionParser<MPTokenIssuanceCreate, MPTokenIssuanceCreateInstructions> = (
  tx,
  meta,
) => {
  const issuanceID = meta.mpt_issuance_id

  return {
    issuanceID,
    metadata: convertHexToString(tx.MPTokenMetadata),
    transferFee:tx.TransferFee,
    assetScale: tx.AssetScale,
    maxAmount:convertHexToString(tx.MaximumAmount)
  }
}
