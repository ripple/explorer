import { ConfidentialMPTConvertBack } from './types'

export function parser(tx: ConfidentialMPTConvertBack) {
  return {
    amount: {
      currency: tx.MPTokenIssuanceID,
      amount: BigInt(tx.MPTAmount).toString(10),
      isMPT: true,
    },
  }
}
