interface SignerEntry {
  SignerEntry: {
    Account: string;
    SignerWeight: string;
  };
}

export function parser(tx: any) {
  // TODO: update when Sidechain return bug is fixed
  return {
    account: tx.Account,
    sourceDoor: tx.Sidechain?.src_chain_door || 'rFakeAccount',
    sourceIssue: tx.Sidechain?.src_chain_issue || 'fakeXRP',
    destinationDoor: tx.Sidechain?.dst_chain_door || 'rFakeAccount2',
    destinationIssue: tx.Sidechain?.dst_chain_issue || 'fakeXRP2',
    signerQuorum: tx.SignerQuorum,
    signerEntries: tx.SignerEntries.map((entry: SignerEntry) => entry.SignerEntry),
  };
}
