import { Simple } from '../Simple'
import mockXChainCommit from './mock_data/XChainCommit.json'
import mockXChainCommitInsufficientFunds from './mock_data/XChainCommitInsufficientFunds.json'

import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const createWrapper = createSimpleRenderFactory(Simple)

describe('XChainCommitSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCommit)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(wrapper, 'claim-id', '4')
    expect(wrapper.find(`[data-testid="destination"]`)).not.toExist()
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockXChainCommitInsufficientFunds)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'send', '\uE90010,000.00 XRP')
    expectSimpleRowText(wrapper, 'claim-id', '3')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
  })
})
