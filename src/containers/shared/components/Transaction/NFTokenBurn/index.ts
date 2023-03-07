import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const NFTokenBurnTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.NFT,
  parser,
}
