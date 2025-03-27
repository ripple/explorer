import {
  Amount,
  ExplorerAmount,
  MPTAmount,
} from '../../../containers/shared/types'
import { XRP_BASE } from '../utils'

export const isMPTAmount = (amount: Amount): amount is MPTAmount =>
  (amount as MPTAmount).mpt_issuance_id !== undefined &&
  (amount as MPTAmount).value !== undefined

export const formatAmount = (d: Amount | number): ExplorerAmount => {
  if (d == null) {
    return d
  }

  if (typeof d === 'string' || typeof d === 'number')
    return {
      currency: 'XRP',
      amount: Number(d) / XRP_BASE,
    }

  return isMPTAmount(d)
    ? {
        currency: d.mpt_issuance_id,
        amount: d.value,
        isMPT: true,
      }
    : {
        currency: d.currency,
        issuer: d.issuer,
        amount: Number(d.value),
      }
}
