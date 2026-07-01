export interface MPTokenIssuanceCreateInstructions {
  issuanceID?: string
  metadata?: string
  transferFee?: number
  assetScale?: number
  maxAmount?: string
  // i18n keys of the fields/flags declared mutable via Dynamic MPT (XLS-94).
  mutableFlags?: string[]
}
