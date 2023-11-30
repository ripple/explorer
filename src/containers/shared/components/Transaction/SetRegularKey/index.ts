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
}
