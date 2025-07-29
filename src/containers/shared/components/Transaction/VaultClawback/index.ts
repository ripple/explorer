import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'

export const VaultClawbackTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.OTHER,
}
