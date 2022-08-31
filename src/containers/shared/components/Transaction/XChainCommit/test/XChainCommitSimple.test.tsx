import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainCommit from './mock_data/XChainCommit.json'
import mockXChainCommitInsufficientFunds from './mock_data/XChainCommitInsufficientFunds.json'
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

describe('XChainCommitSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCommit)

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
    expectText(wrapper, 'claim-id', '4')
    expect(wrapper.find(`[data-test="destination"]`)).not.toExist()
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockXChainCommitInsufficientFunds)

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

    expectText(wrapper, 'send', '\uE90010,000.00 XRP')
    expectText(wrapper, 'claim-id', '3')
    expectText(wrapper, 'destination', 'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi')
  })
})
