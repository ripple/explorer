import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAccountCreateCommit from './mock_data/XChainAccountCreateCommit.json'
import mockXChainAccountCreateCommitInsufficientFunds from './mock_data/XChainAccountCreateCommitInsufficientFunds.json'
import { expectSimpleRowText } from '../../test/expectations'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainAccountCreateCommitSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainAccountCreateCommit)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', 'XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(wrapper.find(`[data-test="destination"] a`)).not.toExist()
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(
      mockXChainAccountCreateCommitInsufficientFunds,
    )

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
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'send', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      wrapper,
      'destination',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expect(wrapper.find(`[data-test="destination"] a`)).not.toExist()
  })
})
