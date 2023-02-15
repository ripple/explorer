import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainCommitTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.XCHAIN,
  parser,
}
