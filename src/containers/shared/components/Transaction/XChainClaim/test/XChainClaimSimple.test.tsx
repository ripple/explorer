import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainClaim from './mock_data/XChainClaim.json'
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

describe('XChainClaimSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainClaim)

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

    expectText(wrapper, 'amount', '\uE90010.00 XRP')
    expectText(wrapper, 'destination', 'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi')
    expectText(wrapper, 'claim-id', '5')
  })
})
