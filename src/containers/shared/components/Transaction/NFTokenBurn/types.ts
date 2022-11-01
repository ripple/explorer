import { TransactionCommonFields } from '../types'

export interface NFTokenBurn extends TransactionCommonFields {
  NFTokenID: string
  Owner?: string
}

export interface NFTokenBurnInstructions {
  tokenID: string
  owner?: string
}
