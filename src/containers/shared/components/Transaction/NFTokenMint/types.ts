export interface NFTokenMintInstructions {
  tokenID: string
  tokenTaxon: number
  uri?: string
  transferFee?: number
  issuer?: string
}
