import { convertScaledPrice } from '../parser'

describe('convertScaledPrice', () => {
  it('should convert scaled price to original price correctly using scale factor', () => {
    // scaled price: 5083
    expect(convertScaledPrice('13db', 4)).toEqual('0.5083')
    // scaled price: 12
    expect(convertScaledPrice('c', 3)).toEqual('0.012')
    // scaled price: 12
    expect(convertScaledPrice('c', 11)).toEqual('0.00000000012')
    // scaled price: 1234567891234
    expect(convertScaledPrice('11f71fb0922', 6)).toEqual('1234567.891234')
    // scaled price: 1000000000000
    expect(convertScaledPrice('e8d4a51000', 0)).toEqual('1000000000000')
    // scaled price: 1234123412341234
    expect(convertScaledPrice('4626dbf9a01f2', 1)).toEqual('123412341234123.4')
    // scaled price: 12341234123412341234
    expect(convertScaledPrice('ab44df0c6fec01f2', 12)).toEqual(
      '12341234.123412341234',
    )
    // scaled price: 9007199254740991
    expect(convertScaledPrice('1fffffffffffff', 10)).toEqual(
      '900719.9254740991',
    )
  })
})
