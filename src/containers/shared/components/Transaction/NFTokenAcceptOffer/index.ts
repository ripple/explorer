import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const NFTokenAcceptOfferTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Nft',
  parser,
}
