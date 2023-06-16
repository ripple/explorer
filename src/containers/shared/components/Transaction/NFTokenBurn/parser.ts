import { NFTokenBurn } from 'xrpl'
import { NFTokenBurnInstructions } from './types'
import { TransactionParser } from '../types'

export const parser: TransactionParser<NFTokenBurn, NFTokenBurnInstructions> = (
  tx,
) => ({
  tokenID: tx.NFTokenID,
  owner: tx.Owner,
})
