import { cleanup, render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import TxToken from '../TxToken'

import withdrawUSDMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw_usd.json'
import withdrawXRPMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw_xrp.json'
import withdrawMock from '../Transaction/AMMWithdraw/test/mock_data/withdraw.json'
import paymentMock from '../Transaction/Payment/test/mock_data/Payment.json'

import summarizeTransaction from '../../../../rippled/lib/txSummary'

describe('TxToken', () => {
  afterEach(cleanup)
  const renderComponent = (transaction: any) =>
    render(
      <I18nextProvider i18n={i18n}>
        <TxToken tx={summarizeTransaction(transaction, true)} />
      </I18nextProvider>,
    )

  it('to render for a Payment transaction', () => {
    const { container } = renderComponent(paymentMock)

    expect(container).toHaveTextContent('\uE900 XRP')
  })

  it('to render for a NON Payment transaction with only issued currency', () => {
    const { container } = renderComponent(withdrawUSDMock)

    expect(container).toHaveTextContent('USD')
  })

  it('to render for a NON Payment transaction with only XRP', () => {
    const { container } = renderComponent(withdrawXRPMock)

    expect(container).toHaveTextContent('\uE900 XRP')
  })

  it('to render for a NON Payment transaction with multiple amounts', () => {
    const { container } = renderComponent(withdrawMock)

    expect(container).toHaveTextContent('\uE900 XRP and USD')
  })
})
