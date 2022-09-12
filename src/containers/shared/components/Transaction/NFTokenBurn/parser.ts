import { NFTokenBurnInstructions } from './types'
import { TransactionParser } from '../types'

export const parser: TransactionParser<NFTokenBurnInstructions> = (
  tx,
  meta,
) => ({
  tokenID: tx.NFTokenID,
})
