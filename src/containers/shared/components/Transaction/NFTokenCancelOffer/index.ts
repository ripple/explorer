import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const NFTokenCancelOfferTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.NFT,
  parser,
}
