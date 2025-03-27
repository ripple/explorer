import { convertScaledPrice } from '../../../../utils'

const numberToHex = (number) => number.toString(16)
describe('convertScaledPrice', () => {
  it('should convert scaled price to original price correctly using scale factor', () => {
    expect(convertScaledPrice(numberToHex(5083), 4)).toEqual('0.5083')
    expect(convertScaledPrice(numberToHex(12), 3)).toEqual('0.012')
    expect(convertScaledPrice(numberToHex(12), 11)).toEqual('0.00000000012')
    expect(convertScaledPrice(numberToHex(1234567891234), 6)).toEqual(
      '1234567.891234',
    )
    expect(convertScaledPrice(numberToHex(1000000000000), 0)).toEqual(
      '1000000000000',
    )
    expect(convertScaledPrice(numberToHex(1234123412341234), 1)).toEqual(
      '123412341234123.4',
    )
    expect(convertScaledPrice(numberToHex(12341234123412341234n), 12)).toEqual(
      '12341234.123412341234',
    )
    expect(convertScaledPrice(numberToHex(9007199254740991), 10)).toEqual(
      '900719.9254740991',
    )
  })
})
