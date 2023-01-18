import { Simple } from './Simple'
import { TransactionMapping } from '../../types'
import { parser } from './parser'

export const AMMWithdraw: TransactionMapping = {
  Simple,
  parser,
}
