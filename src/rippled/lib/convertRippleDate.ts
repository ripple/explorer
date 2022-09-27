import { unix } from 'moment'

export const EPOCH_OFFSET = 946684800
export const convertRippleDate = (date: number) =>
  unix(date + EPOCH_OFFSET)
    .utc()
    .format()
