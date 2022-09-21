import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18nTestConfig'
import summarize from '../../../../../../rippled/lib/txSummary'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

const createWrapper = (tx: any) =>
  mount(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <TableDetail
          instructions={summarize(tx, true).details.instructions}
          type={tx.tx.TransactionType}
        />
      </I18nextProvider>
    </BrowserRouter>,
  )
describe('EscrowFinishTableDetail', () => {
  it('renders EscrowFinish without crashing', () => {
    const wrapper = createWrapper(mockEscrowFinish)
    wrapper.unmount()
  })
})
