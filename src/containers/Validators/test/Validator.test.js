import { render, screen, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import { BAD_REQUEST } from '../../shared/utils'
import { Validator } from '../index'
import { getLedger } from '../../../rippled'
import NetworkContext from '../../shared/NetworkContext'
import testConfigEnglish from '../../../i18n/testConfigEnglish'
import { QuickHarness, flushPromises } from '../../test/utils'
import { VALIDATOR_ROUTE } from '../../App/routes'

global.location = '/validators/aaaa'

const MOCK_IDENTIFIER = 'mock-validator-hash'

jest.mock('../../../rippled', () => ({
  __esModule: true,
  getLedger: jest.fn(),
}))

describe('Validator container', () => {
  const renderValidator = (props = {}) => {
    const defaultGetLedgerImpl = () =>
      new Promise(
        () => {},
        () => {},
      )
    getLedger.mockImplementation(props.getLedgerImpl || defaultGetLedgerImpl)

    return render(
      <NetworkContext.Provider value={props.network || 'main'}>
        <QuickHarness
          i18n={testConfigEnglish}
          initialEntries={[`/validators/${MOCK_IDENTIFIER}`]}
        >
          <Route path={VALIDATOR_ROUTE.path} element={<Validator />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )
  }

  beforeEach(async () => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('renders without crashing', () => {
    const { container } = renderValidator()
    expect(container.querySelector('.validator')).toBeInTheDocument()
  })

  it('renders loading', () => {
    const { container } = renderValidator()
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  it('sets title to domain', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          domain: 'example.com',
          ledger_hash: 'sample-ledger-hash',
          master_key: 'foo',
        },
      },
    )
    renderValidator()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator example.com')
  })

  it('sets title to master_key', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          master_key: 'foo',
          ledger_hash: 'sample-ledger-hash',
        },
      },
    )
    renderValidator()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator foo...')
  })

  it('sets title to signing_key', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          signing_key: 'bar',
          ledger_hash: 'sample-ledger-hash',
        },
      },
    )
    renderValidator()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator bar...')
  })

  it('fetches ledger hash if not provided', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          master_key: 'foo',
          domain: 'test.example.com',
          current_index: '12345',
        },
      },
    )
    const ledger = {
      status: 200,
      response: {
        ledger_hash: 'sample-ledger-hash',
        last_ledger_time: 123456789,
      },
    }
    renderValidator({
      getLedgerImpl: () => Promise.resolve(ledger),
    })
    await flushPromises()
    await flushPromises()
    expect(getLedger).toHaveBeenCalledTimes(1)
    expect(getLedger).toHaveBeenCalledWith('12345', undefined)
    expect(document.title).toBe('Validator test.example.com')
  })

  it('renders 404 page on no match', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: BAD_REQUEST,
        response: { error: 'something went wrong' },
      },
    )
    const { container } = renderValidator()
    await flushPromises()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.no-match')).toBeInTheDocument()
    })
  })

  it('displays all details except last ledger date/time on ledger 404 error', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: 200,
        response: {
          master_key: 'foo',
          domain: 'test.example.com',
          current_index: '12345',
        },
      },
    )

    const notFoundError = new Error('Ledger not found')
    notFoundError.response = { status: 404 }

    const { container } = renderValidator({
      getLedgerImpl: () => Promise.reject(notFoundError),
    })

    await flushPromises()
    await flushPromises()

    expect(getLedger).toHaveBeenCalledWith('12345', undefined)
    expect(document.title).toBe('Validator test.example.com')
    // test ledger-time isn't updated
    expect(
      container.querySelector('[data-testid="ledger-time"]'),
    ).not.toBeInTheDocument()
    // test ledger-index stays the same
    const lastLedgerIndex = container.querySelector(
      '[data-testid="ledger-index"]',
    )
    expect(lastLedgerIndex).toBeInTheDocument()
    expect(lastLedgerIndex.querySelector('.value')).toHaveTextContent('12345')
  })
})
