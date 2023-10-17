import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import TxToken from '../TxToken'

import withdrawUSDMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw_usd.json'
import withdrawXRPMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw_xrp.json'
import withdrawMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw.json'
import paymentMock from '../Transaction/Payment/test/mock_data/Payment.json'

import summarizeTransaction from '../../../../rippled/lib/txSummary'

describe('TxToken', () => {
  const createWrapper = (transaction: any) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <TxToken tx={summarizeTransaction(transaction, true)} />
      </I18nextProvider>,
    )

  it('to render for a Payment transaction', () => {
    const wrapper = createWrapper(paymentMock)

    expect(wrapper).toHaveText('\uE900 XRP')
  })

  it('to render for a NON Payment transaction with only issued currency', () => {
    const wrapper = createWrapper(withdrawUSDMock)

    expect(wrapper).toHaveText('USD')
  })

  it('to render for a NON Payment transaction with only XRP', () => {
    const wrapper = createWrapper(withdrawXRPMock)

    expect(wrapper).toHaveText('\uE900 XRP')
  })

  it('to render for a NON Payment transaction with multiple amounts', () => {
    const wrapper = createWrapper(withdrawMock)

    expect(wrapper).toHaveText('\uE900 XRP and USD')
  })
})
