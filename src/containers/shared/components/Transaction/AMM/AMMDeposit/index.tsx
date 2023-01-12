import { Simple } from '../AMMSharedSimple'
import { TransactionMapping } from '../../types'
import { parser } from './parser'

export const AMMDeposit: TransactionMapping = {
  Simple,
  parser,
}
