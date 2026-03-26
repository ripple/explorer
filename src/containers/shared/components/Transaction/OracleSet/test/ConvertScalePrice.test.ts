import { convertScaledPrice } from '../../../../utils'

const numberToHex = (number: number | bigint) => number.toString(16)

describe('convertScaledPrice', () => {
  describe('with hex string input (Price Oracles)', () => {
    it('should convert scaled hex price to decimal string', () => {
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
      expect(
        convertScaledPrice(numberToHex(12341234123412341234n), 12),
      ).toEqual('12341234.123412341234')
      // 2^54
      expect(convertScaledPrice(numberToHex(18014398509481984), 10)).toEqual(
        '1801439.8509481984',
      )
    })

    it('should handle hex strings that look like decimal numbers', () => {
      // 256 in hex is "100", 4096 in hex is "1000"
      expect(convertScaledPrice('100', 0)).toEqual('256')
      expect(convertScaledPrice('1000', 0)).toEqual('4096')
    })
  })

  describe('with number input (MPT amounts)', () => {
    it('should convert scaled number to decimal string', () => {
      expect(convertScaledPrice(1000000, 6)).toEqual('1')
      expect(convertScaledPrice(1500000, 6)).toEqual('1.500000')
      expect(convertScaledPrice(123456789, 4)).toEqual('12345.6789')
      expect(convertScaledPrice(100, 2)).toEqual('1')
      expect(convertScaledPrice(1, 3)).toEqual('0.001')
    })

    it('should handle scale of 0', () => {
      expect(convertScaledPrice(1000000, 0)).toEqual('1000000')
      expect(convertScaledPrice(42, 0)).toEqual('42')
    })

    it('should handle large numbers', () => {
      // 2^54
      expect(convertScaledPrice(18014398509481984, 10)).toEqual(
        '1801439.8509481984',
      )
    })
  })

  describe('with bigint input (MPT amounts)', () => {
    it('should convert scaled bigint to decimal string', () => {
      expect(convertScaledPrice(1000000n, 6)).toEqual('1')
      expect(convertScaledPrice(12341234123412341234n, 12)).toEqual(
        '12341234.123412341234',
      )
    })
  })
})
