import type { MPTokenIssuanceCreate } from 'xrpl'
import { MPTokenIssuanceCreateInstructions } from './types'
import { TransactionParser } from '../types'
import {
  buildFlags,
  convertHexToString,
} from '../../../../../rippled/lib/utils'
import { MPT_IMMUTABLE_FLAGS } from '../../../transactionUtils'

// TODO: use MPTokenIssuanceCreate when DynamicMPT is supported on xrpl.js
interface MPTokenIssuanceCreateExtended extends MPTokenIssuanceCreate {
  ImmutableFlags?: number
}

export const parser: TransactionParser<
  MPTokenIssuanceCreateExtended,
  MPTokenIssuanceCreateInstructions
> = (tx, meta) => {
  const immutableFlags = buildFlags(tx.ImmutableFlags, MPT_IMMUTABLE_FLAGS)
  return {
    issuanceID: meta.mpt_issuance_id,
    metadata: tx.MPTokenMetadata
      ? convertHexToString(tx.MPTokenMetadata)
      : undefined,
    transferFee: tx.TransferFee,
    assetScale: tx.AssetScale,
    maxAmount: tx.MaximumAmount
      ? BigInt(tx.MaximumAmount).toString(10)
      : undefined,
    immutableFlags: immutableFlags.length ? immutableFlags : undefined,
  }
}
