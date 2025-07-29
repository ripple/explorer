import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'

export const VaultSetTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
