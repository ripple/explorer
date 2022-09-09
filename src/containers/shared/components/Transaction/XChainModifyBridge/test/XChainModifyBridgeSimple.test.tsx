import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainModifyBridge from './mock_data/XChainModifyBridge.json'
import mockXChainModifyBridgeMinAccountCreateAmount from './mock_data/XChainModifyBridgeMinAccountCreateAmount.json'
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

describe('XChainModifyBridgeSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainModifyBridge)

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
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectText(wrapper, 'issuing-chain-issue', 'XRP')

    expectText(wrapper, 'signature-reward', '\uE9000.01 XRP')
  })

  it('renders MinAccountCreateAmount', () => {
    const wrapper = createWrapper(mockXChainModifyBridgeMinAccountCreateAmount)

    // check XChainBridge parts
    expectText(
      wrapper,
      'locking-chain-door',
      'rnBnyot2gCJywLxLzfHQX2dUJqZ6oghUFp',
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

    expectText(wrapper, 'min-account-create-amount', '\uE900100.00 XRP')
  })
})
