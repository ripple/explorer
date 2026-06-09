import { ConfidentialMPTConvert } from './types'

export function parser(tx: ConfidentialMPTConvert) {
  return {
    amount: {
      currency: tx.MPTokenIssuanceID,
      amount: BigInt(tx.MPTAmount).toString(10),
      isMPT: true,
    },
    holderEncryptionKey: tx.HolderEncryptionKey,
  }
}
