import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { TableDetail } from '../TableDetail'
import mockSignerListSetClear from './mock_data/SignerListSetClear.json'
import mockSignerListSet from './mock_data/SignerListSet.json'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'
import i18n from '../../../../../../i18nTestConfig'
import { SimpleRow } from '../../SimpleRow'

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true)
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <TableDetail instructions={data.details.instructions} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

describe('SignerListSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockSignerListSet)
    expect(wrapper).toHaveText('signers: 3 - quorum: 3/4')
    wrapper.unmount()
  })

  it('renders when signer list is cleared', () => {
    const wrapper = createWrapper(mockSignerListSetClear)
    expect(wrapper).toHaveText('unset_signer_list')
    wrapper.unmount()
  })
})
