import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const DelegateSetTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  Description,
  action: TransactionAction.CREATE,
  category: TransactionCategory.ACCOUNT,
}
