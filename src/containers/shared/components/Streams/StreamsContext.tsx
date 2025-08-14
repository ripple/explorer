import { contextFactory } from '../../helpers'
import { Ledger, Metrics } from './types'

const [StreamsContext, useStreams] = contextFactory<{
  metrics: Metrics
  ledgers: Record<number, Ledger>
  validators: Record<string, any>
}>({
  hook: 'useStreams',
  provider: 'StreamsProvider',
})

export { StreamsContext, useStreams }
