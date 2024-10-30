import { render, screen, cleanup } from '@testing-library/react'
import { Route } from 'react-router'
import mockLedger from './storedLedger.json'
import i18n from '../../../i18n/testConfig'
import { Ledger } from '../index'
import { getLedger } from '../../../rippled'
import { Error as RippledError } from '../../../rippled/lib/utils'
import { QuickHarness, flushPromises } from '../../test/utils'

jest.mock('../../../rippled', () => {
  const originalModule = jest.requireActual('../../../rippled')

  return {
    __esModule: true,
    ...originalModule,
    getLedger: jest.fn(),
  }
})

const mockedGetLedger = getLedger

describe('Ledger container', () => {
  const renderComponent = (identifier = 38079857) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/ledgers/${identifier}`]}>
        <Route path="/ledgers/:identifier" element={<Ledger />} />
      </QuickHarness>,
    )

  afterEach(() => {
    cleanup()
    mockedGetLedger.mockReset()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders loading', () => {
    renderComponent()
    expect(screen.queryAllByTestId('loader')).toBeDefined()
  })

  it('renders ledger navbar', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    renderComponent()
    await flushPromises()

    const header = screen.queryAllByTestId('ledger-header')
    expect(header).toBeDefined()
    expect(header.queryByTestId('ledger-nav')).toBeDefined()
    expect(header.queryByTestId('ledger-nav a')).toHaveLength(2)
  })

  it('renders ledger summary', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    renderComponent()
    await flushPromises()

    const summary = screen.queryAllByTestId('ledger-info')

    expect(summary).toBeDefined()
    expect(summary.queryByTestId('ledger-cols')).toBeDefined()
    expect(summary.queryByTestId('ledger-col')).toHaveLength(3)
    expect(summary.queryByTestId('ledger-index')).toBeDefined()
    expect(summary.queryByTestId('closed-date')).toBeDefined()
    expect(summary.queryByTestId('ledger-hash')).toBeDefined()
  })

  it('renders transaction table header', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    renderComponent()
    await flushPromises()

    const table = screen.queryByTitle('transaction-table')
    expect(table).toBeDefined()
    expect(table.queryByTestId('transaction-li-header')).toBeDefined()
    expect(table.queryByTestId('transaction-li-header .col-type')).toHaveLength(
      1,
    )
    expect(
      table.queryByTestId('transaction-li-header .col-account'),
    ).toBeDefined()
  })

  it('renders all transactions', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    renderComponent()
    await flushPromises()

    const table = screen.queryByTitle('transaction-table')
    expect(table).toBeDefined()
    expect(table.queryByTestId('transaction-li')).toHaveLength(
      mockLedger.transactions.length + 1, // include the header
    )
  })

  it('renders 404 page on no match', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger not found', 404)),
    )

    renderComponent()
    await flushPromises()

    expect(screen.queryByTitle('no-match')).toHaveTextContent(
      'ledger_not_found',
    )
  })

  it('renders server error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger failed', 500)),
    )

    renderComponent()
    await flushPromises()

    expect(screen.getByTitle('no-match')).toHaveTextContent('generic_error')
  })

  it('renders invalid id error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('invalid ledger index/hash', 400)),
    )

    renderComponent('aaaa')
    await flushPromises()

    expect(screen.getByTitle('no-match')).toHaveTextContent('invalid_ledger_id')
  })
})
