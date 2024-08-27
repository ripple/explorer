import { mount } from 'enzyme'
import { Route } from 'react-router'
import mockTransaction from './mock_data/Transaction.json'
import mockTransactionSummary from './mock_data/TransactionSummary.json'
import i18n from '../../../i18n/testConfig'
import { Transaction } from '../index'
import { TxStatus } from '../../shared/components/TxStatus'
import { getTransaction } from '../../../rippled'
import { Error as RippledError } from '../../../rippled/lib/utils'
import { flushPromises, QuickHarness } from '../../test/utils'
import Mock = jest.Mock

jest.mock('../../../rippled', () => {
  const originalModule = jest.requireActual('../../../rippled')

  return {
    __esModule: true,
    ...originalModule,
    getTransaction: jest.fn(),
  }
})

const mockedGetTransaction: Mock = getTransaction as Mock

window.location.assign(
  '/transactions/50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774',
)

describe('Transaction container', () => {
  const createWrapper = (
    hash = '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774',
    tab = 'simple',
  ) =>
    mount(
      <QuickHarness
        i18n={i18n}
        initialEntries={[`/transactions/${hash}/${tab}`]}
      >
        <Route
          path="/transactions/:identifier?/:tab?"
          element={<Transaction />}
        />
      </QuickHarness>,
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
      Promise.reject(new RippledError('transaction not found', 404)),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.no-match .title')).toHaveText('transaction_not_found')
    expect(wrapper.find('.no-match .hint').at(0)).toHaveText(
      'server_ledgers_hint',
    )
    expect(wrapper.find('.no-match .hint').at(1)).toHaveText(
      'check_transaction_hash',
    )
    wrapper.unmount()
  })

  it('renders invalid hash page', async () => {
    const wrapper = createWrapper('aaaa')
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.no-match .title')).toHaveText(
      'invalid_transaction_hash',
    )
    expect(wrapper.find('.no-match .hint')).toHaveText('check_transaction_hash')
    wrapper.unmount()
  })

  it('renders error page', async () => {
    mockedGetTransaction.mockImplementation(() =>
      Promise.reject(new RippledError('transaction not validated', 500)),
    )
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.no-match .title')).toHaveText('generic_error')
    expect(wrapper.find('.no-match .hint')).toHaveText('not_your_fault')
    wrapper.unmount()
  })

  describe('with results', () => {
    let wrapper

    beforeEach(async () => {
      const transaction = {
        processed: mockTransaction,
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

      // console.log(wrapper.debug())
      expect(wrapper.find('.txid').length).toBe(2)
      expect(wrapper.find('.txid').at(0).text()).toBe(
        `hash: ${mockTransaction.hash}`,
      )
      expect(wrapper.find('.txid').at(1).text()).toBe(
        `CTID: ${mockTransaction.tx.ctid}`,
      )
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
      expect(wrapper.find('.json-view').length).toBe(1)
      wrapper.unmount()
    })
  })
})
