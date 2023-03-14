import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import mockTransaction from './mock_data/Transaction.json'
import mockTransactionSummary from './mock_data/TransactionSummary.json'
import i18n from '../../../i18n/testConfig'
import { Transaction } from '../index'
import { TxStatus } from '../../shared/components/TxStatus'
import { testQueryClient } from '../../test/QueryClient'
import { getTransaction } from '../../../rippled'
import { Error } from '../../../rippled/lib/rippled'
import { flushPromises } from '../../test/utils'

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getTransaction: jest.fn(),
}))

const mockedGetTransaction = getTransaction

global.location = '/transactions/aaaa'

describe('Transaction container', () => {
  const createWrapper = (hash = 'aaaa', tab = 'simple') =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <Router initialEntries={[`/transactions/${hash}/${tab}`]}>
            <Route
              path="/transactions/:identifier?/:tab?"
              component={Transaction}
            />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )
  afterEach(() => {
    mockedGetTransaction.mockReset()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders loading', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders 404 page on no match', async () => {
    mockedGetTransaction.mockImplementation(() =>
      Promise.reject(new Error('transaction not found', 404)),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.no-match').length).toBe(1)
    wrapper.unmount()
  })

  describe('with results', () => {
    let wrapper

    beforeEach(async () => {
      const transaction = {
        raw: mockTransaction,
        summary: mockTransactionSummary,
      }

      mockedGetTransaction.mockImplementation(() =>
        Promise.resolve(transaction),
      )
    })

    it('renders summary section', async () => {
      wrapper = createWrapper(mockTransaction.hash)
      await flushPromises()
      wrapper.update()

      expect(wrapper.find('.transaction').length).toBe(1)
      const summary = wrapper.find('.summary')
      expect(summary.length).toBe(1)
      expect(summary.contains(<div className="type">OfferCreate</div>)).toBe(
        true,
      )
      expect(
        summary.contains(
          <div className="hash" title={mockTransaction.hash}>
            {mockTransaction.hash}
          </div>,
        ),
      ).toBe(true)
      expect(summary.contains(<TxStatus status="tesSUCCESS" />)).toBe(true)
      expect(wrapper.find('.tabs').length).toBe(1)
      expect(wrapper.find('a.tab').length).toBe(3)
      expect(wrapper.find('a.tab').at(0).props().title).toBe('simple')
      expect(wrapper.find('a.tab').at(1).props().title).toBe('detailed')
      expect(wrapper.find('a.tab').at(2).props().title).toBe('raw')
      expect(wrapper.find('a.tab.selected').text()).toEqual('simple')
      wrapper.unmount()
    })

    it('renders detailed tab', async () => {
      wrapper = createWrapper(mockTransaction.hash, 'detailed')
      await flushPromises()
      wrapper.update()

      expect(wrapper.find('a.tab.selected').text()).toEqual('detailed')
      expect(wrapper.find('.detail-body').length).toBe(1)
      wrapper.unmount()
    })

    it('renders raw tab', async () => {
      wrapper = createWrapper(mockTransaction.hash, 'raw')
      await flushPromises()
      wrapper.update()

      expect(wrapper.find('a.tab.selected').text()).toEqual('raw')
      expect(wrapper.find('.react-json-view').length).toBe(1)
      wrapper.unmount()
    })
  })
})
