import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { Description } from './Description'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const DepositPreauthTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  parser,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.ACCOUNT,
}
