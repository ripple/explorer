import { Simple } from './Simple'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const AMMClawback: TransactionMapping = {
  TableDetail,
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.DEX,
  parser,
}
