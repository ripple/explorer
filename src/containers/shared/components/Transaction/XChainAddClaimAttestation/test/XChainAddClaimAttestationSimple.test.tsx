import { describe, it, expect } from 'vitest'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAddClaimAttestation from './mock_data/XChainAddClaimAttestation.json'
import { expectSimpleRowText } from '../../test/expectations'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainAddClaimAttestationSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainAddClaimAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'r3ZsJYkBao2qiwUCvmjfgEUquKueLAwPxQ',
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

    expectSimpleRowText(wrapper, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'other_chain_source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expect(wrapper.find(`[data-test="destination"] a`)).toExist()
    expectSimpleRowText(wrapper, 'xchain-claim-id', '1')
  })
})
