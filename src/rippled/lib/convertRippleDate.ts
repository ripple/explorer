import moment from 'moment'

export const EPOCH_OFFSET = 946684800
export const convertRippleDate = (date: number) =>
  moment(date + EPOCH_OFFSET)
    .utc()
    .format()
