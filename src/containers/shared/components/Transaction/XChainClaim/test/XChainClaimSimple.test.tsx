import { describe, it, expect } from 'vitest'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainClaim from './mock_data/XChainClaim.json'

const createWrapper = createSimpleWrapperFactory(Simple)
describe('XChainClaimSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainClaim)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', 'XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expectSimpleRowText(wrapper, 'claim-id', '5')
  })
})
