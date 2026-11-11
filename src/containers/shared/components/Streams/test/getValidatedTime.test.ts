import { getValidatedTime } from '../getValidatedTime'
import { convertRippleDate } from '../../../../../rippled/lib/convertRippleDate'
import { LedgerValidation } from '../types'

const validation = (publicKey: string, signingTime: number): LedgerValidation =>
  ({
    // eslint-disable-next-line camelcase -- matches the xrpl ValidationStream shape
    validation_public_key: publicKey,
    // eslint-disable-next-line camelcase -- matches the xrpl ValidationStream shape
    signing_time: signingTime,
  }) as LedgerValidation

const UNL_A = 'unl-validator-a'
const UNL_B = 'unl-validator-b'
const NOT_UNL = 'non-unl-validator'

describe('getValidatedTime', () => {
  it('returns null when the UNL list is unavailable', () => {
    const validations = [validation(UNL_A, 100), validation(UNL_B, 200)]
    expect(getValidatedTime(validations, undefined, 2)).toBeNull()
    expect(getValidatedTime(validations, [], 2)).toBeNull()
  })

  it('returns null when the quorum is unavailable', () => {
    const validations = [validation(UNL_A, 100), validation(UNL_B, 200)]
    expect(getValidatedTime(validations, [UNL_A, UNL_B], undefined)).toBeNull()
    expect(getValidatedTime(validations, [UNL_A, UNL_B], 0)).toBeNull()
    expect(
      getValidatedTime(validations, [UNL_A, UNL_B], 'not-a-number'),
    ).toBeNull()
  })

  it('returns null until enough UNL validations have arrived', () => {
    const validations = [validation(NOT_UNL, 50), validation(UNL_A, 100)]
    expect(getValidatedTime(validations, [UNL_A, UNL_B], 2)).toBeNull()
  })

  it('ignores validations from validators not on the UNL', () => {
    const validations = [
      validation(NOT_UNL, 999),
      validation(UNL_A, 100),
      validation(UNL_B, 200),
    ]
    expect(getValidatedTime(validations, [UNL_A, UNL_B], 2)).toBe(
      convertRippleDate(200),
    )
  })

  it('accepts quorum passed as a numeric string', () => {
    const validations = [validation(UNL_A, 100), validation(UNL_B, 200)]
    expect(getValidatedTime(validations, [UNL_A, UNL_B], '2')).toBe(
      convertRippleDate(200),
    )
  })

  it('is stable once quorum is reached: a later validation never changes the result', () => {
    const atQuorum = [validation(UNL_A, 100), validation(UNL_B, 200)]
    const afterMoreArrive = [
      ...atQuorum,
      validation('unl-validator-c', 50), // earlier signing_time, arrives late
    ]
    const unl = [UNL_A, UNL_B, 'unl-validator-c']
    expect(getValidatedTime(afterMoreArrive, unl, 2)).toBe(
      getValidatedTime(atQuorum, unl, 2),
    )
  })

  it('uses the latest signing_time among the first quorum UNL validations, not arrival order', () => {
    const validations = [validation(UNL_A, 200), validation(UNL_B, 100)]
    expect(getValidatedTime(validations, [UNL_A, UNL_B], 2)).toBe(
      convertRippleDate(200),
    )
  })
})
