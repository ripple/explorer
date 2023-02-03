import moment from 'moment'

const MILLIS_PER_SECOND = 1000
export const EPOCH_OFFSET = 946684800000
export const convertRippleDate = (date: number) =>
  moment(date * MILLIS_PER_SECOND + EPOCH_OFFSET)
    .utc()
    .format()
