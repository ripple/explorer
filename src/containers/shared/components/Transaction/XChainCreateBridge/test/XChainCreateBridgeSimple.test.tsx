import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Simple } from '../Simple'
import mockXChainCreateBridge from './mock_data/XChainCreateBridge.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainCreateBridgeSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCreateBridge)

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
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
  })
})
