import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { TrustSet } from './types'

export const parser = (tx: TrustSet) => ({
  limit: formatAmount(tx.LimitAmount),
})
