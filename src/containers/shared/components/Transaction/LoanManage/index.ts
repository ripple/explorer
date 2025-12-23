import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const LoanManageTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
