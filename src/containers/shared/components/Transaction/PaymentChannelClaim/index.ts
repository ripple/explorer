import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const PaymentChannelClaimTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
