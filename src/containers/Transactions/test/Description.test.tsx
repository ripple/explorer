import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfigEnglish'
import { TransactionDescription } from '../DetailTab/Description'
import Transaction from './mock_data/Transaction.json'
import OfferCreateTicket from './mock_data/OfferCreateTicket.json'
import EmittedPayment from './mock_data/EmittedPayment.json'
import { queryClient } from '../../shared/QueryClient'

describe('Description container', () => {
  const createWrapper = (data = {}) =>
    mount(
      <Router>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <TransactionDescription data={data} />
          </I18nextProvider>
        </QueryClientProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders transaction', () => {
    const wrapper = createWrapper(Transaction)
    wrapper.unmount()
  })

  it('renders sequence number with ticket', () => {
    const wrapper = createWrapper(OfferCreateTicket)
    expect(wrapper.find(`[data-testid="sequence"]`)).toHaveText(
      '79469284 (a Ticket was used for this Transaction)',
    )
    wrapper.unmount()
  })

  it('renders sequence number with hook', () => {
    const wrapper = createWrapper(EmittedPayment)
    expect(wrapper.find(`[data-testid="sequence"]`)).toHaveText(
      '0 (this Transaction was emitted by a Hook)',
    )
    wrapper.unmount()
  })
})
