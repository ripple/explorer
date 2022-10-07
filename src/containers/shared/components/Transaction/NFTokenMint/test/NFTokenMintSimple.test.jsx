import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Simple as NFTokenMint } from '../Simple'
import transactionModified2 from './mock_data/NFTokenMintModified2.json'
import transactionModified1Created1 from './mock_data/NFTokenMintModified1Created1.json'
import transactionModified2Created1 from './mock_data/NFTokenMintMostModified2Created1.json'
import transactionWithIssuer from './mock_data/NFTokenMintWithIssuer.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'

describe('NFTokenMint', () => {
  it('handles NFTokenMint that modified 2 nodes', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionModified2, true).details}
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
    expect(wrapper.find('[data-test="token-issuer"] .value').exists()).toBe(
      false,
    )
    wrapper.unmount()
  })

  it('handles NFTokenMint that modified 1 node and created 1 node', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={
              summarizeTransaction(transactionModified1Created1, true).details
            }
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
    expect(wrapper.find('[data-test="token-issuer"] .value').exists()).toBe(
      false,
    )
    wrapper.unmount()
  })

  it('handles NFTokenMint that modified 2 nodes and created 1 node', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={
              summarizeTransaction(transactionModified2Created1, true).details
            }
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
    expect(wrapper.find('[data-test="token-issuer"] .value').exists()).toBe(
      false,
    )
    wrapper.unmount()
  })

  it('handles NFTokenMint with issuer', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <NFTokenMint
            data={summarizeTransaction(transactionWithIssuer, true).details}
          />
        </Router>
      </I18nextProvider>,
    )
    expect(wrapper.find('[data-test="token-issuer"] .value').exists()).toBe(
      true,
    )
    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000861A8A99B4460C2A4CCC90634FD9C7F51940AD9450BE30000099B00000000',
    )
    expect(wrapper.find('[data-test="token-taxon"] .value')).toHaveText('0')
    expect(wrapper.find('[data-test="token-uri"] .value')).toHaveText(
      'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
    )
    expect(wrapper.find('[data-test="token-issuer"] .value')).toHaveText(
      'rGToUZ1JjRUdv1wXNXKMFn2o4wTM2DLkpg',
    )
    wrapper.unmount()
  })
})
