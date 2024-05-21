import { convertScaledPrice } from '../parser'

describe('convertScaledPrice', () => {
  it('should convert scaled price to original price correctly using scale factor', () => {
    expect(convertScaledPrice('13db', 4)).toEqual(0.5083)
    expect(convertScaledPrice('c', 3)).toEqual(0.012)
    expect(convertScaledPrice('11f71fb0922', 6)).toEqual(1234567.89123)
    expect(convertScaledPrice('e8d4a51000', 0)).toEqual(1000000000000)
    expect(convertScaledPrice('4626dbf9a01f2', 1)).toEqual(123412341234123.4)
    expect(convertScaledPrice('ab44df0c6fec01f2', 12)).toEqual(12341234.12341)
  })
})
