import {
  MPTokenIssuanceCreate,
  MPTokenIssuanceCreateInstructions,
} from './types'
import { TransactionParser } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { convertHexToBigInt } from '../../../utils'

export const parser: TransactionParser<
  MPTokenIssuanceCreate,
  MPTokenIssuanceCreateInstructions
> = (tx, meta) => ({
  issuanceID: meta.mpt_issuance_id,
  metadata: tx.MPTokenMetadata
    ? convertHexToString(tx.MPTokenMetadata)
    : undefined,
  transferFee: tx.TransferFee,
  assetScale: tx.AssetScale,
  maxAmount: tx.MaximumAmount
    ? convertHexToBigInt(tx.MaximumAmount).toString(10)
    : undefined,
})
