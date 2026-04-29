import { ConfidentialMPTSend } from './types'

export function parser(tx: ConfidentialMPTSend) {
  return {
    mptIssuanceID: tx.MPTokenIssuanceID,
    destination: tx.Destination,
    credentialIDs: tx.CredentialIDs ?? [],
  }
}
