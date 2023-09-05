import { type AMMDelete } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const AMMDeleteTransaction: TransactionMapping = {
  Description,
  TableDetail,
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.DEX,
  parser: (tx: AMMDelete): AMMDelete => tx,
}
