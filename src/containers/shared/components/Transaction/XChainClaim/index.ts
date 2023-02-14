import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainClaimTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.FINISH,
  category: TransactionCategory.XCHAIN,
  parser,
}
