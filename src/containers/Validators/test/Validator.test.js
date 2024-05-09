import { mount } from 'enzyme'
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
  const createWrapper = (props = {}) => {
    const defaultGetLedgerImpl = () =>
      new Promise(
        () => {},
        () => {},
      )
    getLedger.mockImplementation(props.getLedgerImpl || defaultGetLedgerImpl)

    return mount(
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
    const wrapper = createWrapper()
    expect(wrapper.find('.validator').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loading', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.loader').length).toBe(1)
    wrapper.unmount()
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
    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator example.com')
    wrapper.unmount()
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
    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator foo...')
    wrapper.unmount()
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
    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    expect(document.title).toBe('Validator bar...')
    wrapper.unmount()
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
    const wrapper = createWrapper({
      getLedgerImpl: () => Promise.resolve(ledger),
    })
    await flushPromises()
    await flushPromises()
    expect(getLedger).toBeCalledTimes(1)
    expect(getLedger).toHaveBeenCalledWith('12345', undefined)
    expect(document.title).toBe('Validator test.example.com')
    wrapper.unmount()
  })

  it('renders 404 page on no match', async () => {
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/validator/${MOCK_IDENTIFIER}`,
      {
        status: BAD_REQUEST,
        response: { error: 'something went wrong' },
      },
    )
    const wrapper = createWrapper()
    await flushPromises()
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('.no-match').length).toBe(1)
    wrapper.unmount()
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

    const wrapper = createWrapper({
      getLedgerImpl: () => Promise.reject(notFoundError),
    })

    await flushPromises()
    await flushPromises()

    wrapper.update()

    expect(getLedger).toBeCalledWith('12345', undefined)
    expect(document.title).toBe('Validator test.example.com')
    // test ledger-time isn't updated
    const lastLedgerDateTime = wrapper.find(`[data-testid="ledger-time"]`)
    expect(lastLedgerDateTime).not.toExist()
    // test ledger-index stays the same
    const lastLedgerIndex = wrapper.find(`[data-testid="ledger-index"]`)
    expect(lastLedgerIndex).toExist()
    expect(lastLedgerIndex.find('.value')).toHaveText('12345')
    wrapper.unmount()
  })
})
