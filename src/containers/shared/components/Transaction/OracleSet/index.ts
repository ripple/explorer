import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const OracleSetTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.DEX,
  parser,
}
