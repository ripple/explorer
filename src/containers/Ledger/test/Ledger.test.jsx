import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import mockLedger from './storedLedger.json'
import i18n from '../../../i18n/testConfig'
import { Ledger } from '../index'
import { getLedger } from '../../../rippled'
import { testQueryClient } from '../../test/QueryClient'
import { Error as RippledError } from '../../../rippled/lib/utils'

vi.mock('../../../rippled', async () => {
  const originalModule = await vi.importActual('../../../rippled')

  return {
    __esModule: true,
    ...originalModule,
    getLedger: vi.fn(),
  }
})

const mockedGetLedger = getLedger

export function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

describe('Ledger container', () => {
  const createWrapper = (identifier = 38079857) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={testQueryClient}>
          <Router initialEntries={[`/ledgers/${identifier}`]}>
            <Route exact path="/ledgers/:identifier" component={Ledger} />
          </Router>
        </QueryClientProvider>
      </I18nextProvider>,
    )

  afterEach(() => {
    mockedGetLedger.mockReset()
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

  it('renders ledger navbar', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const header = wrapper.find('.ledger-header')
    expect(header.length).toBe(1)
    expect(header.find('.ledger-nav').length).toBe(1)
    expect(header.find('.ledger-nav a').length).toBe(2)
    wrapper.unmount()
  })

  it('renders ledger summary', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const summary = wrapper.find('.ledger-header .ledger-info')

    expect(summary.length).toBe(1)
    expect(summary.find('.ledger-cols').length).toBe(1)
    expect(summary.find('.ledger-col').length).toBe(3)
    expect(summary.find('.ledger-index').length).toBe(1)
    expect(summary.find('.closed-date').length).toBe(1)
    expect(summary.find('.ledger-hash').length).toBe(1)

    wrapper.unmount()
  })

  it('renders transaction table header', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const table = wrapper.find('.transaction-table')
    expect(table.length).toBe(1)
    expect(table.find('.transaction-li-header').length).toBe(1)
    expect(table.find('.transaction-li-header .col-type').length).toBe(1)
    expect(table.find('.transaction-li-header .col-account').length).toBe(1)
    wrapper.unmount()
  })

  it('renders all transactions', async () => {
    mockedGetLedger.mockImplementation(() => Promise.resolve(mockLedger))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const table = wrapper.find('.transaction-table')
    expect(table.length).toBe(1)
    expect(table.find('.transaction-li').length).toBe(
      mockLedger.transactions.length + 1, // include the header
    )
    wrapper.unmount()
  })

  it('renders 404 page on no match', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger not found', 404)),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.no-match .title').text()).toEqual('ledger_not_found')
    wrapper.unmount()
  })

  it('renders server error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('ledger failed', 500)),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.no-match .title').text()).toEqual('generic_error')
    wrapper.unmount()
  })

  it('renders invalid id error', async () => {
    mockedGetLedger.mockImplementation(() =>
      Promise.reject(new RippledError('invalid ledger index/hash', 400)),
    )

    const wrapper = createWrapper('aaaa')
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.no-match .title').text()).toEqual('invalid_ledger_id')
    wrapper.unmount()
  })
})
