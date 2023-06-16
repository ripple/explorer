import type { AccountSet } from 'xrpl'

import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const AccountSetTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: AccountSet): AccountSet => tx,
}
