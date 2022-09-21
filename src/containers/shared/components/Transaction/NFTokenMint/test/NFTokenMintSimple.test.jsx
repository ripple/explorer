import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Simple as NFTokenMint } from '../Simple'
import transaction from './mock_data/NFTokenMint.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'

describe('NFTokenMint', () => {
  it('handles NFTokenMint simple view ', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint data={summarizeTransaction(transaction, true).details} />
        </Router>
      </I18nextProvider>,
    )
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C535743B40000001A',
    )
    expect(wrapper.find('[data-test="token-taxon"] .value')).toHaveText('1')
    expect(wrapper.find('[data-test="token-taxon"] .label')).toHaveText(
      'Token Taxon',
    )
    expect(wrapper.find('[data-test="token-uri"] .value')).toHaveText(
      'https://gregweisbrod.com',
    )
    wrapper.unmount()
  })
})
