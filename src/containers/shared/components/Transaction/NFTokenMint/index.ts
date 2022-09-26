import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const NFTokenMintTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Nft',
  parser,
}
