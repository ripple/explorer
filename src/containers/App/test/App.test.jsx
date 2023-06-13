import { mount } from 'enzyme'
import moxios from 'moxios'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { XrplClient } from 'xrpl-client'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import { AppWrapper } from '../index'
import MockWsClient from '../../test/mockWsClient'
import { getAccountInfo } from '../../../rippled/lib/rippled'
import { flushPromises } from '../../test/utils'

// We need to mock `react-router-dom` because otherwise the BrowserRouter in `App` will
// get confused about being inside another Router (the `MemoryRouter` in the `mount`),
// and the routing won't actually happen in the test
jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types -- not really needed for tests
    BrowserRouter: ({ children }) => <div>{children}</div>,
  }
})

jest.mock('../../Ledgers/LedgerMetrics', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('xrpl-client', () => ({
  XrplClient: jest.fn(),
}))

jest.mock('../../../rippled/lib/rippled', () => {
  const originalModule = jest.requireActual('../../../rippled/lib/rippled')

  return {
    __esModule: true,
    ...originalModule,
    getAccountInfo: jest.fn(),
  }
})

jest.mock('../../../rippled', () => {
  const originalModule = jest.requireActual('../../../rippled')
  const { formatTransaction } = jest.requireActual('../../../rippled/lib/utils')

  return {
    __esModule: true,
    ...originalModule,
    getTransaction: () =>
      Promise.resolve({
        raw: formatTransaction({
          TransactionType: 'OfferCreate',
          meta: {
            TransactionResult: 'tecKILLED',
          },
        }),
      }),
    getAccountTransactions: () => Promise.resolve({}),
    getAccountState: () => Promise.resolve({}),
    getLedger: () => Promise.resolve({}),
  }
})

const mockXrplClient = XrplClient
const mockGetAccountInfo = getAccountInfo

describe('App container', () => {
  const mockStore = configureMockStore([thunk])
  const createWrapper = (path = '/') => {
    const store = mockStore(initialState)
    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <I18nextProvider i18n={i18n}>
            <AppWrapper />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    )
  }

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/get_network/s2.ripple.com`,
      { status: 200, response: { result: 'success', network: '3' } },
    )
    mockGetAccountInfo.mockImplementation(() =>
      Promise.resolve({
        flags: 0,
      }),
    )
    mockXrplClient.mockImplementation(() => new MockWsClient())
    // BrowserRouter.mockImplementation(({ children }) => <div>{children}</div>)
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    process.env = oldEnvs
  })

  it('renders main parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.content').length).toBe(1)
    expect(wrapper.find('.footer').length).toBe(1)
    wrapper.unmount()
  })

  it('renders home', () => {
    const wrapper = createWrapper()
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers')
      expect(wrapper.find('.ledgers').length).toBe(1)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/',
          page_title: `xrpl_explorer | ledgers`,
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders ledger explorer page', async () => {
    const wrapper = createWrapper('/ledgers')
    await flushPromises()
    await flushPromises()
    wrapper.update()

    expect(document.title).toEqual('xrpl_explorer | ledgers')
    expect(window.dataLayer).toEqual([
      {
        page_path: '/',
        page_title: `xrpl_explorer | ledgers`,
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
    wrapper.unmount()
  })

  it('renders not found page', () => {
    const wrapper = createWrapper('/zzz')
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | not_found_default_title')
      expect(window.dataLayer).toEqual([
        {
          description: 'not_found_default_title -- not_found_check_url',
          event: 'not_found',
          network: 'mainnet',
          page_path: '/zzz',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders ledger page', async () => {
    const id = 12345
    const wrapper = createWrapper(`/ledgers/${id}`)
    await flushPromises()
    await flushPromises() // flush ledger request
    wrapper.update()

    expect(document.title).toEqual(`xrpl_explorer | ledger ${id}`)
    expect(window.dataLayer).toEqual([
      {
        page_path: '/ledgers/12345',
        page_title: `xrpl_explorer | ledger ${id}`,
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
    wrapper.unmount()
  })

  it('renders transaction page', async () => {
    const id =
      '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774'
    const wrapper = createWrapper(`/transactions/${id}`)
    await flushPromises()
    await flushPromises() // flush transaction request
    wrapper.update()

    expect(document.title).toEqual(
      `xrpl_explorer | transaction_short 50BB0CC6...`,
    )
    expect(window.dataLayer).toEqual([
      {
        page_path:
          '/transactions/50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774',
        page_title: 'xrpl_explorer | transaction_short 50BB0CC6...',
        event: 'screen_view',
        network: 'mainnet',
        tec_code: 'tecKILLED',
        transaction_action: 'CREATE',
        transaction_category: 'DEX',
        transaction_type: 'OfferCreate',
      },
    ])
    wrapper.unmount()
  })

  it('renders transaction page with invalid hash', () => {
    const id = '12345'
    const wrapper = createWrapper(`/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | invalid_transaction_hash`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/transactions/12345',
          event: 'not_found',
          network: 'mainnet',
          description: 'invalid_transaction_hash -- check_transaction_hash',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders transaction page with no hash', () => {
    const wrapper = createWrapper(`/transactions/`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(wrapper.find('.no-match .title')).toHaveText(
        'transaction_empty_title',
      )
      expect(wrapper.find('.no-match .hint')).toHaveText(
        'transaction_empty_hint',
      )
      expect(window.dataLayer).toEqual([
        {
          page_path: '/transactions/',
          event: 'not_found',
          network: 'mainnet',
          description: 'transaction_empty_title -- transaction_empty_hint',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders account page for classic address', () => {
    const id = 'rZaChweF5oXn'
    const wrapper = createWrapper(`/accounts/${id}#ssss`)
    flushPromises()
    flushPromises()
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/rZaChweF5oXn#ssss',
          page_title: 'xrpl_explorer | rZaChweF5oXn...',
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders account page for x-address', () => {
    const id = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    const wrapper = createWrapper(`/accounts/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | XVVFXHFdehYh...`)
      expect(window.dataLayer).toEqual([
        {
          page_path:
            '/accounts/XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG#ssss',
          page_title: `xrpl_explorer | XVVFXHFdehYh...`,
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
      expect(mockGetAccountInfo).toBeCalledWith(
        expect.anything(),
        'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb',
      )
      wrapper.unmount()
    })
  })

  it('renders account page with no id', () => {
    const wrapper = createWrapper(`/accounts/`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(wrapper.find('.no-match .title')).toHaveText('account_empty_title')
      expect(wrapper.find('.no-match .hint')).toHaveText('account_empty_hint')
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/',
          event: 'not_found',
          network: 'mainnet',
          description: 'account_empty_title -- account_empty_hint',
        },
      ])
      wrapper.unmount()
    })
  })

  it('redirects legacy transactions page', () => {
    const id =
      '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774'
    const wrapper = createWrapper(`/#/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(
        `xrpl_explorer | transaction_short 50BB0CC6...`,
      )
      expect(window.dataLayer).toEqual([
        {
          page_path:
            '/transactions/50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774',
          event: 'screen_view',
          network: 'mainnet',
          page_title: 'xrpl_explorer | transaction_short 50BB0CC6...',
          tec_code: 'tecKILLED',
          transaction_action: 'CREATE',
          transaction_category: 'DEX',
          transaction_type: 'OfferCreate',
        },
      ])
      wrapper.unmount()
    })
  })

  it('redirects legacy account page', () => {
    const id = 'rZaChweF5oXn'
    const wrapper = createWrapper(`/#/graph/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/rZaChweF5oXn#ssss',
          page_title: 'xrpl_explorer | rZaChweF5oXn...',
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
      wrapper.unmount()
    })
  })

  it('renders custom mode', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST //  For custom as there is no p2p.
    const wrapper = createWrapper('/s2.ripple.com/')
    await flushPromises()
    wrapper.update()
    // Make sure the sockets aren't double initialized.
    expect(XrplClient).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
