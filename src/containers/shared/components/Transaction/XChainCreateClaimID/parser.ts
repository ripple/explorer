export function parser(tx: any) {
  // TODO: update when Bridge return bug is fixed
  return {
    lockingDoor: tx.Bridge?.src_chain_door || 'rFakeAccount',
    lockingIssue: tx.Bridge?.src_chain_issue || 'fakeXRP',
    issuingDoor: tx.Bridge?.dst_chain_door || 'rFakeAccount2',
    issuingIssue: tx.Bridge?.dst_chain_issue || 'fakeXRP2',
    signatureReward: tx.SignatureReward,
    otherChainAccount: tx.OtherChainAccount,
  }
}
