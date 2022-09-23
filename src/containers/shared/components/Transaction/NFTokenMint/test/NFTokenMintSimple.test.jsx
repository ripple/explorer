import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Simple as NFTokenMint } from '../Simple'
import transaction1 from './mock_data/NFTokenMint1.json'
import transaction2 from './mock_data/NFTokenMint2.json'
import transaction3 from './mock_data/NFTokenMint3.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'

describe('NFTokenMint', () => {
  it('handles NFTokenMint simple view 1', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transaction1, true).details}
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

  it('handles NFTokenMint simple view 2', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transaction2, true).details}
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

  describe('NFTokenMint', () => {
    it('handles NFTokenMint simple view 3', () => {
      const wrapper = mount(
        <I18nextProvider i18n={i18n}>
          <Router>
            <NFTokenMint
              data={summarizeTransaction(transaction3, true).details}
            />
          </Router>
        </I18nextProvider>,
      )
      expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
        '000800006203F49C21D5D6E022CB16DE3538F248662FC73C535743B40000001A',
      )
      expect(wrapper.find('[data-test="token-taxon"] .value')).toHaveText('1')
      expect(wrapper.find('[data-test="token-uri"] .value')).toHaveText(
        'https://gregweisbrod.com',
      )
      wrapper.unmount()
    })
  })
})
