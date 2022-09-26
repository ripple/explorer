import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const NFTokenCreateOfferTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Nft',
  parser,
}
