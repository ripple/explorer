import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainAccountCreate from './mock_data/XChainAccountCreate.json'
import mockXChainAccountCreateInsufficientFunds from './mock_data/XChainAccountCreateInsufficientFunds.json'
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

function expectText(
  wrapper: ReactWrapper<any, Readonly<{}>>,
  dataTest: string,
  text: string,
) {
  expect(wrapper.find(`[data-test="${dataTest}"] .value`)).toHaveText(text)
}

describe('XChainAccountCreateSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainAccountCreate)

    // check XChainBridge parts
    expectText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).toExist()
    expectText(wrapper, 'locking-chain-issue', 'XRP')
    expectText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectText(wrapper, 'issuing-chain-issue', 'XRP')

    expectText(wrapper, 'send', '\uE90010.00 XRP')
    expectText(wrapper, 'destination', 'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym')
    expect(wrapper.find(`[data-test="destination"] a`)).not.toExist()
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(mockXChainAccountCreateInsufficientFunds)

    // check XChainBridge parts
    expectText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectText(wrapper, 'locking-chain-issue', 'XRP')
    expectText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectText(wrapper, 'issuing-chain-issue', 'XRP')

    expectText(wrapper, 'send', '\uE9001,000.00 XRP')
    expectText(wrapper, 'destination', 'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym')
    expect(wrapper.find(`[data-test="destination"] a`)).not.toExist()
  })
})
