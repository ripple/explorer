export function parser(tx: any) {
  return {
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    signatureReward: tx.SignatureReward,
    otherChainAccount: tx.OtherChainAccount,
  }
}
