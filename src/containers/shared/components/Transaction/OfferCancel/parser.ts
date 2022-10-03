import { OfferCancel } from './types'

export const parser = (tx: OfferCancel) => ({
  cancel: tx.OfferSequence,
})
