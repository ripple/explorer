import type { TrustSet } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

export const parser = (tx: TrustSet) => ({
  limit: formatAmount(tx.LimitAmount),
})
