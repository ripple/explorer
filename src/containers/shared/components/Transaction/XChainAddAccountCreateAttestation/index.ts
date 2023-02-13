import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainAddAccountCreateAttestationTransaction: TransactionMapping =
  {
    Simple,
    action: TransactionAction.CREATE,
    category: TransactionCategory.XCHAIN,
    parser,
  }
