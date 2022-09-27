export interface PaymentInstructions {
  partial: boolean
  amount: {
    amount: number
    currency: string
    issuer: string
  }
  max: {
    amount: number
    currency: string
    issuer: string
  }
  convert: {
    amount: number
    currency: string
    issuer: string
  }
  destination:
    | {
        split: any
      }
    | string
  sourceTag: number
}
