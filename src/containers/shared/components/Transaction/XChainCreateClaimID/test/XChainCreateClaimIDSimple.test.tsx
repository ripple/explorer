import { describe, it, expect } from 'vitest'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainCreateClaimID from './mock_data/XChainCreateClaimID.json'
import mockXChainCreateClaimIDFailed from './mock_data/XChainCreateClaimIDFailed.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainCreateClaimIDSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCreateClaimID)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rNe5NbD1hqCSZPz9KM5PHm5Bf8jjHfezPE',
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

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      wrapper,
      'other-chain-source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(wrapper, 'claim-id', '1')
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(mockXChainCreateClaimIDFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', 'XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      wrapper,
      'other-chain-source',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(wrapper.find(`[data-test="claim-id"]`)).not.toExist()
  })
})
