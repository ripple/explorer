import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const LoanBrokerCoverClawbackTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  parser,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.OTHER,
}
