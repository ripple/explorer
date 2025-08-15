import { contextFactory } from '../../helpers'
import { Ledger, Metrics } from './types'
import { StreamValidator } from '../../vhsTypes'

const [StreamsContext, useStreams] = contextFactory<{
  metrics: Metrics
  ledgers: Record<number, Ledger>
  validators: Record<string, StreamValidator>
}>({
  hook: 'useStreams',
  provider: 'StreamsProvider',
})

export { StreamsContext, useStreams }
