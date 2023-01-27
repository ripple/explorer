import { Amount, ExplorerAmount } from '../../../containers/shared/types'
import { XRP_BASE } from '../utils'

export const formatAmount = (d: Amount | number): ExplorerAmount => {
  if (d == null) {
    return d
  }
  return typeof d !== 'string' && typeof d !== 'number'
    ? {
        currency: d.currency,
        issuer: d.issuer,
        amount: Number(d.value),
      }
    : {
        currency: 'XRP',
        amount: Number(d) / XRP_BASE,
      }
}
