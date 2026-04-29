import { ConfidentialMPTClawback } from './types'

export function parser(tx: ConfidentialMPTClawback) {
  return {
    amount: {
      currency: tx.MPTokenIssuanceID,
      amount: BigInt(tx.MPTAmount).toString(10),
      isMPT: true,
    },
    holder: tx.Holder,
  }
}
