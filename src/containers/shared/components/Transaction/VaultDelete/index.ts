import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'

export const VaultDeleteTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.FINISH,
  category: TransactionCategory.OTHER,
}
