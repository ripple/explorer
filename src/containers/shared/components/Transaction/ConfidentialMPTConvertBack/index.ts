import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const ConfidentialMPTConvertBackTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.MPT,
  parser,
}
