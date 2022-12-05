import { TransactionMapping } from 'containers/shared/components/Transaction/types'

import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { parser } from './parser'

export const AMMVote: TransactionMapping = {
  Simple,
  parser,
}
