import type { NFTokenMint } from 'xrpl'
import { NFTokenMintInstructions } from './types'
import { TransactionParser } from '../types'

import { convertHexToString } from '../../../../../rippled/lib/utils'

export const parser: TransactionParser<NFTokenMint, NFTokenMintInstructions> = (
  tx,
  meta,
) => ({
  tokenID: meta.nftoken_id,
  tokenTaxon: tx.NFTokenTaxon,
  uri: convertHexToString(tx.URI),
  transferFee: tx.TransferFee,
  issuer: tx.Issuer,
})
