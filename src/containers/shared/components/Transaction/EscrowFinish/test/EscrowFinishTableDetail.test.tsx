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
    expect(wrapper.find('[data-test="escrow-account"]')).toHaveText(
      `finish_escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`,
    )
    expect(wrapper.find('[data-test="escrow-amount"]')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-fullfillment"]')).toHaveText(
      `fulfillment Fulfillment `,
    )
    wrapper.unmount()
  })
})
