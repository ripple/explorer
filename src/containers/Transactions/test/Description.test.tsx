import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfigEnglish'
import { TransactionDescription } from '../DetailTab/Description'
import Transaction from './mock_data/Transaction.json'
import OfferCreateTicket from './mock_data/OfferCreateTicket.json'
import EmittedPayment from './mock_data/EmittedPayment.json'
import DelegatePayment from './mock_data/DelegatePayment.json'
import { queryClient } from '../../shared/QueryClient'

describe('Description container', () => {
  const renderDescription = (data = {}) =>
    render(
      <Router>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <TransactionDescription data={data} />
          </I18nextProvider>
        </QueryClientProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    renderDescription()
  })

  it('renders transaction', () => {
    renderDescription(Transaction)
  })

  it('renders sequence number with ticket', () => {
    const { container } = renderDescription(OfferCreateTicket)
    expect(
      container.querySelector('[data-testid="sequence"]'),
    ).toHaveTextContent('79469284 (a Ticket was used for this Transaction)')
  })

  it('renders sequence number with hook', () => {
    const { container } = renderDescription(EmittedPayment)
    expect(
      container.querySelector('[data-testid="sequence"]'),
    ).toHaveTextContent('0 (this Transaction was emitted by a Hook)')
  })

  it('renders delegate', () => {
    const { container } = renderDescription(DelegatePayment)
    expect(
      container.querySelector('[data-testid="delegate"]'),
    ).toHaveTextContent(
      'The transaction is delegated to rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
  })
})
