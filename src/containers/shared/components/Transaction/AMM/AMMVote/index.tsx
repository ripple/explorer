import { Simple } from './simple'
import { TransactionMapping } from '../../types'

import { parser } from './parser'

export const AMMVote: TransactionMapping = {
  Simple,
  parser,
}
