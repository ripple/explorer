import { NFTokenBurn, NFTokenBurnInstructions } from './types'
import { TransactionParser } from '../types'

export const parser: TransactionParser<NFTokenBurn, NFTokenBurnInstructions> = (
  tx,
) => ({
  tokenID: tx.NFTokenID,
})
