import { Simple } from '../AMMSharedSimple'
import { TransactionMapping } from '../../types'

import { parser } from './parser'

export const AMMVote: TransactionMapping = {
  Simple,
  parser,
}
