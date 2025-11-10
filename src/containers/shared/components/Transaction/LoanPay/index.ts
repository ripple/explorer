import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const LoanPayTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.SEND,
  category: TransactionCategory.OTHER,
}
