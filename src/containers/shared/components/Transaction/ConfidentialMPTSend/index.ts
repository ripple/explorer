import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const ConfidentialMPTSendTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.SEND,
  category: TransactionCategory.MPT,
  parser,
}
