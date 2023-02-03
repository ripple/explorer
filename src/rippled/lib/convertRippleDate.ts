const MILLIS_PER_SECOND = 1000
export const EPOCH_OFFSET = 946684800000
export const convertRippleDate = (date: number) =>
  date * MILLIS_PER_SECOND + EPOCH_OFFSET
