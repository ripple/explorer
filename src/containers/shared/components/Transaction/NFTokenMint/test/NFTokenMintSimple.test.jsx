import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Simple as NFTokenMint } from '../Simple'
import simpleTransaction from './mock_data/NFTokenMint_Simple.json'
import complexTransaction from './mock_data/NFTokenMint_Complex.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'

describe('NFTokenMint', () => {
  it('handles NFTokenMint simple view ', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(simpleTransaction, true).details}
          />
        </Router>
      </I18nextProvider>,
    )
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
    )
    expect(wrapper.find('[data-test="token-taxon"] .value')).toHaveText('1')
    expect(wrapper.find('[data-test="token-uri"] .value')).toHaveText(
      'https://gregweisbrod.com',
    )
    wrapper.unmount()
  })

  it('handles NFTokenMint simple view ', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(complexTransaction, true).details}
          />
        </Router>
      </I18nextProvider>,
    )
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A0DCBA29BA00000020',
    )
    expect(wrapper.find('[data-test="token-taxon"] .value')).toHaveText('1')
    expect(wrapper.find('[data-test="token-uri"] .value')).toHaveText(
      'https://gregweisbrod.com',
    )
    wrapper.unmount()
  })
})
