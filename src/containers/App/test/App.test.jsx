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
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../shared/hooks'
import { Error } from '../../../rippled/lib/utils'

jest.mock('../../Ledgers/LedgerMetrics', () => ({
  __esModule: true,
  LedgerMetrics: () => null,
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
        processed: formatTransaction({
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

jest.mock('../../../rippled/lib/rippled', () => {
  const originalModule = jest.requireActual('../../../rippled/lib/rippled')

  return {
    __esModule: true,
    ...originalModule,
    getAccountInfo: jest.fn(),
  }
})

const mockXrplClient = XrplClient
const mockGetAccountInfo = getAccountInfo

describe('App container', () => {
  const mockStore = configureMockStore([thunk])
  const createWrapper = (
    path = '/',
    localNetworks = [],
    accountInfoMock = () =>
      Promise.resolve({
        flags: 0,
      }),
  ) => {
    mockGetAccountInfo.mockImplementation(accountInfoMock)

    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

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
  let wrapper

  beforeEach(() => {
    moxios.install()
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/get_network/s2.ripple.com`,
      { status: 200, response: { result: 'success', network: '3' } },
    )
    mockXrplClient.mockImplementation(() => new MockWsClient())
    // BrowserRouter.mockImplementation(({ children }) => <div>{children}</div>)
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    wrapper.unmount()
    process.env = oldEnvs
  })

  it('renders main parts', () => {
    wrapper = createWrapper()
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.content').length).toBe(1)
    expect(wrapper.find('.footer').length).toBe(1)
  })

  it('renders home', () => {
    wrapper = createWrapper()
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers')
      expect(wrapper.find('header')).not.toHaveClassName('header-no-network')
      expect(wrapper.find('.ledgers').length).toBe(1)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/',
          page_title: `xrpl_explorer | ledgers`,
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
    })
  })

  it('renders ledger explorer page', async () => {
    wrapper = createWrapper('/ledgers')
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
  })

  it('renders ledger explorer page from index.html redirect', async () => {
    wrapper = createWrapper('/index.html')
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
  })

  it('renders ledger explorer page from index.htm redirect', async () => {
    wrapper = createWrapper('/index.html')
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
  })

  it('renders not found page', () => {
    wrapper = createWrapper('/zzz')
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | not_found_default_title')
      expect(window.dataLayer).toEqual([
        {
          description: 'not_found_default_title -- not_found_check_url',
          event: 'not_found',
          network: 'mainnet',
          page_path: '/zzz',
        },
      ])
    })
  })

  it('renders ledger page', async () => {
    const id = 12345
    wrapper = createWrapper(`/ledgers/${id}`)
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
  })

  it('renders transaction page', async () => {
    const id =
      '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774'
    wrapper = createWrapper(`/transactions/${id}`)
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
  })

  it('renders transaction page with invalid hash', () => {
    const id = '12345'
    wrapper = createWrapper(`/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | invalid_transaction_hash`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/transactions/12345',
          event: 'not_found',
          network: 'mainnet',
          description: 'invalid_transaction_hash -- check_transaction_hash',
        },
      ])
    })
  })

  it('renders transaction page with no hash', () => {
    wrapper = createWrapper(`/transactions/`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
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
    })
  })

  it('renders account page for classic address', () => {
    const id = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb'
    wrapper = createWrapper(`/accounts/${id}#ssss`)
    flushPromises()
    flushPromises()
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | rKV8HEL3vLc6...`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb#ssss',
          page_title: 'xrpl_explorer | rKV8HEL3vLc6...',
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
    })
  })

  it('renders account page for malformed', () => {
    const id = 'rZaChweF5oXn'
    wrapper = createWrapper(`/accounts/${id}#ssss`, [], () =>
      Promise.reject(new Error('account not found', 404)),
    )
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | invalid_xrpl_address`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/rZaChweF5oXn#ssss',
          description: 'invalid_xrpl_address -- check_account_id',
          event: 'not_found',
          network: 'mainnet',
        },
      ])
    })
  })

  it('renders account page for a deleted account', () => {
    const id = 'r35jYntLwkrbc3edisgavDbEdNRSKgcQE6'
    wrapper = createWrapper(`/accounts/${id}#ssss`, [], () =>
      Promise.reject(new Error('account not found', 404)),
    )
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | r35jYntLwkrb...`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/r35jYntLwkrbc3edisgavDbEdNRSKgcQE6#ssss',
          page_title: `xrpl_explorer | r35jYntLwkrb...`,
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
      expect(mockGetAccountInfo).toBeCalledWith(
        expect.anything(),
        'r35jYntLwkrbc3edisgavDbEdNRSKgcQE6',
      )
    })
  })

  it('renders account page for x-address', () => {
    const id = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    wrapper = createWrapper(`/accounts/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
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
    })
  })

  it('renders account page with no id', () => {
    wrapper = createWrapper(`/accounts/`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
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
    })
  })

  it('redirects legacy transactions page', () => {
    const id =
      '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774'
    wrapper = createWrapper(`/#/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
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
    })
  })

  it('redirects legacy account page', () => {
    const id = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb'
    wrapper = createWrapper(`/#/graph/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | rKV8HEL3vLc6...`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/accounts/rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb#ssss',
          page_title: 'xrpl_explorer | rKV8HEL3vLc6...',
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
    })
  })

  it('redirects legacy account page with no account', () => {
    wrapper = createWrapper(`/#/graph/`)
    return new Promise((r) => setTimeout(r, 10)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ledgers`)
      expect(window.dataLayer).toEqual([
        {
          page_path: '/',
          page_title: 'xrpl_explorer | ledgers',
          event: 'screen_view',
          network: 'mainnet',
        },
      ])
    })
  })

  it('renders custom mode homepage', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST //  For custom as there is no p2p.
    wrapper = createWrapper('/')
    await flushPromises()
    wrapper.update()
    expect(wrapper.find('header')).toHaveClassName('header-no-network')
    // We don't know the endpoint yet.
    expect(XrplClient).toHaveBeenCalledTimes(0)
    expect(document.title).toEqual(`xrpl_explorer`)
  })

  it('renders custom mode ledgers', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST //  For custom as there is no p2p.
    const network = 's2.ripple.com'
    wrapper = createWrapper(`/${network}/`)
    await flushPromises()
    wrapper.update()
    // Make sure the sockets aren't double initialized.
    expect(wrapper.find('header')).not.toHaveClassName('header-no-network')
    expect(XrplClient).toHaveBeenCalledTimes(1)
    expect(document.title).toEqual(`xrpl_explorer | ledgers`)
  })
})
