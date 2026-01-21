import { render, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import mockLedger from './storedLedger.json'
import i18n from '../../../i18n/testConfig'
import { Ledger } from '../index'
import { getLedger } from '../../../rippled'
import { Error as RippledError } from '../../../rippled/lib/utils'
import { QuickHarness } from '../../test/utils'

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
  const renderLedger = (identifier = 38079857) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/ledgers/${identifier}`]}>
        <Route path="/ledgers/:identifier" element={<Ledger />} />
      </QuickHarness>,
    )

  afterEach(() => {
    mockedGetLedger.mockReset()
  })

  it('renders without crashing', () => {
    renderLedger()
  })

  it('renders loading', () => {
    const { container } = renderLedger()
    expect(container.querySelectorAll('.loader').length).toBe(1)
  })

  it('renders ledger navbar', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const { container } = renderLedger()

    await waitFor(() => {
      expect(container.querySelector('.ledger-header')).toBeInTheDocument()
    })

    const header = container.querySelector('.ledger-header')
    expect(header).toBeInTheDocument()
    expect(header.querySelectorAll('.ledger-nav').length).toBe(1)
    expect(header.querySelectorAll('.ledger-nav a').length).toBe(2)
  })

  it('renders ledger summary', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const { container } = renderLedger()

    await waitFor(() => {
      expect(
        container.querySelector('.ledger-header .ledger-info'),
      ).toBeInTheDocument()
    })

    const summary = container.querySelector('.ledger-header .ledger-info')
    expect(summary).toBeInTheDocument()
    expect(summary.querySelectorAll('.ledger-cols').length).toBe(1)
    expect(summary.querySelectorAll('.ledger-col').length).toBe(3)
    expect(summary.querySelectorAll('.ledger-index').length).toBe(1)
    expect(summary.querySelectorAll('.closed-date').length).toBe(1)
    expect(summary.querySelectorAll('.ledger-hash').length).toBe(1)
  })

  it('renders transaction table header', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const { container } = renderLedger()

    await waitFor(() => {
      expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    })

    const table = container.querySelector('.transaction-table')
    expect(table).toBeInTheDocument()
    expect(table.querySelectorAll('.transaction-li-header').length).toBe(1)
    expect(
      table.querySelectorAll('.transaction-li-header .col-type').length,
    ).toBe(1)
    expect(
      table.querySelectorAll('.transaction-li-header .col-account').length,
    ).toBe(1)
  })

  it('renders all transactions', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const { container } = renderLedger()

    await waitFor(() => {
      expect(container.querySelector('.transaction-table')).toBeInTheDocument()
    })

    const table = container.querySelector('.transaction-table')
    expect(table).toBeInTheDocument()
    expect(table.querySelectorAll('.transaction-li').length).toBe(
      mockLedger.transactions.length + 1, // include the header
    )
  })

  it('renders 404 page on no match', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger not found', 404)),
    )

    const { container } = renderLedger()

    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toBeInTheDocument()
    })

    expect(container.querySelector('.no-match .title').textContent).toEqual(
      'ledger_not_found',
    )
  })

  it('renders server error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger failed', 500)),
    )

    const { container } = renderLedger()

    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toBeInTheDocument()
    })

    expect(container.querySelector('.no-match .title').textContent).toEqual(
      'generic_error',
    )
  })

  it('renders invalid id error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('invalid ledger index/hash', 400)),
    )

    const { container } = renderLedger('aaaa')

    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toBeInTheDocument()
    })

    expect(container.querySelector('.no-match .title').textContent).toEqual(
      'invalid_ledger_id',
    )
  })
})
