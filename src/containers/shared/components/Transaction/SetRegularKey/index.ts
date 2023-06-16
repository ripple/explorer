import type { SetRegularKey } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { Description } from './Description'
import { TableDetail } from './TableDetail'

export const SetRegularKeyTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: SetRegularKey) => tx,
}
