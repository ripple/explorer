import type { MPTokenIssuanceCreate } from 'xrpl'
import { MPTokenIssuanceCreateInstructions } from './types'
import { TransactionParser } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

type MPTokenIssuanceCreateWithDynamic = MPTokenIssuanceCreate & {
  MutableFlags?: number
}

export const parser: TransactionParser<
  MPTokenIssuanceCreateWithDynamic,
  MPTokenIssuanceCreateInstructions
> = (tx, meta) => ({
  issuanceID: meta.mpt_issuance_id,
  metadata: tx.MPTokenMetadata
    ? convertHexToString(tx.MPTokenMetadata)
    : undefined,
  transferFee: tx.TransferFee,
  assetScale: tx.AssetScale,
  maxAmount: tx.MaximumAmount
    ? BigInt(tx.MaximumAmount).toString(10)
    : undefined,
  mutableFlags: tx.MutableFlags,
})
