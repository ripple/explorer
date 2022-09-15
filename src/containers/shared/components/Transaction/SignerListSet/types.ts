export interface SignerEntry {
  Account: string
  SignerWeight: number
}

export interface SignerListSet {
  SignerQuorum: number
  SignerEntries?: { SignerEntry: SignerEntry }[]
}

export interface SignerInstruction {
  account: string
  weight: number
}

export interface SignerListSetInstructions {
  quorum: number
  maxSigners: number
  signers: SignerInstruction[]
}
