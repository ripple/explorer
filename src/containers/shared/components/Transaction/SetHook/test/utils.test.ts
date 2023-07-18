import { hookOnToTxList } from '../utils'

describe('SetHook utils', () => {
  it('hookOnToTxList', () => {
    expect(
      hookOnToTxList(
        '0000000000000000000000000000000000000000000000000000000000000000',
      ),
    ).toEqual(['All transactions'])
    expect(
      hookOnToTxList(
        '0xfffffffffffffffffffffffffffffffffffffff7ffffffffffffffffff9affeb',
      ),
    ).toEqual([
      'Invoke',
      'AccountDelete',
      'CheckCancel',
      'CheckCreate',
      'EscrowCancel',
      'EscrowFinish',
    ])
    expect(
      hookOnToTxList(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbfffff',
      ),
    ).toEqual(undefined)
  })
})
