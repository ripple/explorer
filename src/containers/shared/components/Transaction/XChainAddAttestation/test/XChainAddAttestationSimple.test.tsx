import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainAddAttestationAccountCreate from './mock_data/XChainAddAttestationAccountCreate.json'
import mockXChainAddAttestationClaim from './mock_data/XChainAddAttestationClaim.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Simple data={data.details} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

function expectSimpleRowText(
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) {
  expect(wrapper.find(`[data-test="${dataTest}"] .value`)).toHaveText(text)
}

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
