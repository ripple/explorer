import React from 'react'

import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainAddAttestationAccountCreate from './mock_data/XChainAddAttestationAccountCreate.json'
import mockXChainAddAttestationClaim from './mock_data/XChainAddAttestationClaim.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainAddAttestationSimple', () => {
  it('renders AccountCreate element', () => {
    const wrapper = createWrapper(mockXChainAddAttestationAccountCreate)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rJ34iQkLYzuVQJFYdgXR3XjfhCQmTiyK6S',
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

    expectSimpleRowText(wrapper, 'send', '\uE9005.00 XRP')
    expectSimpleRowText(
      wrapper,
      'account',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rfTi2cbUVbt3xputSqyhgKc1nXFvi7cnvu',
    )
  })

  it('renders Claim element', () => {
    const wrapper = createWrapper(mockXChainAddAttestationClaim)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rJ34iQkLYzuVQJFYdgXR3XjfhCQmTiyK6S',
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
      'account',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expectSimpleRowText(wrapper, 'claim-id', '1')
  })
})
