import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'
import { Description } from './Description'

export const PaymentChannelFundTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.PAYMENT,
  parser,
}
