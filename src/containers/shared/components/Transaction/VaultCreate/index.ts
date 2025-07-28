import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'

export const VaultCreateTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.CREATE,
  category: TransactionCategory.OTHER,
}
