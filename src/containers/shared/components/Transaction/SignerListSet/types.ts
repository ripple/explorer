export interface SignerInstruction {
  account: string
  weight: number
}

export interface SignerListSetInstructions {
  quorum: number
  maxSigners: number
  signers: SignerInstruction[]
}
