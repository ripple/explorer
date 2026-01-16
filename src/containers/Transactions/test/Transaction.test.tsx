import { render, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import mockTransaction from './mock_data/Transaction.json'
import mockTransactionSummary from './mock_data/TransactionSummary.json'
import i18n from '../../../i18n/testConfig'
import { Transaction } from '../index'
import { getTransaction } from '../../../rippled'
import { Error as RippledError } from '../../../rippled/lib/utils'
import { QuickHarness } from '../../test/utils'
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
  const renderTransaction = (
    hash = '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774',
    tab = 'simple',
  ) =>
    render(
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
    renderTransaction()
  })

  it('renders loading', () => {
    const { container } = renderTransaction()
    expect(container.querySelectorAll('.loader').length).toBe(1)
  })

  it('renders 404 page on no match', async () => {
    mockedGetTransaction.mockImplementation(() =>
      Promise.reject(new RippledError('transaction not found', 404)),
    )

    const { container } = renderTransaction()
    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toHaveTextContent(
        'transaction_not_found',
      )
    })
    const hints = container.querySelectorAll('.no-match .hint')
    expect(hints[0]).toHaveTextContent('server_ledgers_hint')
    expect(hints[1]).toHaveTextContent('check_transaction_hash')
  })

  it('renders invalid hash page', async () => {
    const { container } = renderTransaction('aaaa')
    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toHaveTextContent(
        'invalid_transaction_hash',
      )
    })
    expect(container.querySelector('.no-match .hint')).toHaveTextContent(
      'check_transaction_hash',
    )
  })

  it('renders error page', async () => {
    mockedGetTransaction.mockImplementation(() =>
      Promise.reject(new RippledError('transaction not validated', 500)),
    )
    const { container } = renderTransaction()
    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toHaveTextContent(
        'generic_error',
      )
    })
    expect(container.querySelector('.no-match .hint')).toHaveTextContent(
      'not_your_fault',
    )
  })

  describe('with results', () => {
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
      const { container } = renderTransaction(mockTransaction.hash)
      await waitFor(() => {
        expect(container.querySelectorAll('.transaction').length).toBe(1)
      })

      const summary = container.querySelector('.summary')
      expect(summary).toBeInTheDocument()
      expect(summary?.querySelector('.type')).toHaveTextContent('OfferCreate')

      const txids = container.querySelectorAll('.txid')
      expect(txids.length).toBe(2)
      expect(txids[0]).toHaveTextContent(`hash: ${mockTransaction.hash}`)
      expect(txids[1]).toHaveTextContent(`CTID: ${mockTransaction.tx.ctid}`)
      // TxStatus component renders success class for tesSUCCESS
      expect(summary?.querySelector('.tx-status.success')).toBeInTheDocument()
      expect(container.querySelectorAll('.tabs').length).toBe(1)
      const tabs = container.querySelectorAll('a.tab')
      expect(tabs.length).toBe(3)
      expect(tabs[0].getAttribute('title')).toBe('simple')
      expect(tabs[1].getAttribute('title')).toBe('detailed')
      expect(tabs[2].getAttribute('title')).toBe('raw')
      expect(container.querySelector('a.tab.selected')).toHaveTextContent(
        'simple',
      )
    })

    it('renders detailed tab', async () => {
      const { container } = renderTransaction(mockTransaction.hash, 'detailed')
      await waitFor(() => {
        expect(container.querySelector('a.tab.selected')).toHaveTextContent(
          'detailed',
        )
      })
      expect(container.querySelectorAll('.detail-body').length).toBe(1)
    })

    it('renders raw tab', async () => {
      const { container } = renderTransaction(mockTransaction.hash, 'raw')
      await waitFor(() => {
        expect(container.querySelector('a.tab.selected')).toHaveTextContent(
          'raw',
        )
      })
      expect(container.querySelectorAll('.json-view').length).toBe(1)
    })
  })
})
