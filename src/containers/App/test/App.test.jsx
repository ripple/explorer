import { render, cleanup, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { XrplClient } from 'xrpl-client'
import i18n from '../../../i18n/testConfig'
import { AppWrapper } from '../index'
import MockWsClient from '../../test/mockWsClient'
import { getAccountInfo } from '../../../rippled/lib/rippled'
import { flushPromises, V7_FUTURE_ROUTER_FLAGS } from '../../test/utils'
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
  const renderApp = (
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

    return render(
      <MemoryRouter initialEntries={[path]} future={V7_FUTURE_ROUTER_FLAGS}>
        <I18nextProvider i18n={i18n}>
          <AppWrapper />
        </I18nextProvider>
      </MemoryRouter>,
    )
  }

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    moxios.stubRequest(
      `${process.env.VITE_DATA_URL}/get_network/s2.ripple.com`,
      { status: 200, response: { result: 'success', network: '3' } },
    )
    mockXrplClient.mockImplementation(() => new MockWsClient())
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    cleanup()
    process.env = oldEnvs
  })

  it('renders main parts', () => {
    const { container } = renderApp()
    expect(container.querySelectorAll('.header').length).toBe(1)
    expect(container.querySelectorAll('.content').length).toBe(1)
    expect(container.querySelectorAll('.footer').length).toBe(1)
  })

  it('renders home', async () => {
    const { container } = renderApp()
    await waitFor(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers')
    })
    expect(container.querySelector('header')).not.toHaveClass(
      'header-no-network',
    )
    expect(container.querySelectorAll('.ledgers').length).toBe(1)
    expect(window.dataLayer).toEqual([
      {
        page_path: '/',
        page_title: `xrpl_explorer | ledgers`,
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
  })

  it('renders ledger explorer page', async () => {
    renderApp('/ledgers')
    await flushPromises()
    await flushPromises()

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
    renderApp('/index.html')
    await flushPromises()
    await flushPromises()

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
    renderApp('/index.html')
    await flushPromises()
    await flushPromises()

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

  it('renders not found page', async () => {
    renderApp('/zzz')
    await waitFor(() => {
      expect(document.title).toEqual('xrpl_explorer | not_found_default_title')
    })
    expect(window.dataLayer).toEqual([
      {
        description: 'not_found_default_title -- not_found_check_url',
        event: 'not_found',
        network: 'mainnet',
        page_path: '/zzz',
      },
    ])
  })

  it('renders ledger page', async () => {
    const id = 12345
    renderApp(`/ledgers/${id}`)
    await flushPromises()
    await flushPromises()

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
    renderApp(`/transactions/${id}`)
    await flushPromises()
    await flushPromises()

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

  it('renders transaction page with invalid hash', async () => {
    const id = '12345'
    renderApp(`/transactions/${id}`)
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | invalid_transaction_hash`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/transactions/12345',
        event: 'not_found',
        network: 'mainnet',
        description: 'invalid_transaction_hash -- check_transaction_hash',
      },
    ])
  })

  it('renders transaction page with no hash', async () => {
    const { container } = renderApp(`/transactions/`)
    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toBeInTheDocument()
    })
    expect(container.querySelector('.no-match .title').textContent).toBe(
      'transaction_empty_title',
    )
    expect(container.querySelector('.no-match .hint').textContent).toBe(
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

  it('renders account page for classic address', async () => {
    const id = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb'
    renderApp(`/accounts/${id}#ssss`)
    await flushPromises()
    await flushPromises()
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | rKV8HEL3vLc6...`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/accounts/rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb#ssss',
        page_title: 'xrpl_explorer | rKV8HEL3vLc6...',
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
  })

  it('renders account page for malformed', async () => {
    const id = 'rZaChweF5oXn'
    renderApp(`/accounts/${id}#ssss`, [], () =>
      Promise.reject(new Error('account not found', 404)),
    )
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | invalid_xrpl_address`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/accounts/rZaChweF5oXn#ssss',
        description: 'invalid_xrpl_address -- check_account_id',
        event: 'not_found',
        network: 'mainnet',
      },
    ])
  })

  it('renders account page for a deleted account', async () => {
    const id = 'r35jYntLwkrbc3edisgavDbEdNRSKgcQE6'
    renderApp(`/accounts/${id}#ssss`, [], () =>
      Promise.reject(new Error('account not found', 404)),
    )
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | r35jYntLwkrb...`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/accounts/r35jYntLwkrbc3edisgavDbEdNRSKgcQE6#ssss',
        page_title: `xrpl_explorer | r35jYntLwkrb...`,
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
    expect(mockGetAccountInfo).toHaveBeenCalledWith(
      expect.anything(),
      'r35jYntLwkrbc3edisgavDbEdNRSKgcQE6',
    )
  })

  it('renders account page for x-address', async () => {
    const id = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    renderApp(`/accounts/${id}#ssss`)
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | XVVFXHFdehYh...`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path:
          '/accounts/XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG#ssss',
        page_title: `xrpl_explorer | XVVFXHFdehYh...`,
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
    expect(mockGetAccountInfo).toHaveBeenCalledWith(
      expect.anything(),
      'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb',
    )
  })

  it('renders account page with no id', async () => {
    const { container } = renderApp(`/accounts/`)
    await waitFor(() => {
      expect(container.querySelector('.no-match .title')).toBeInTheDocument()
    })
    expect(container.querySelector('.no-match .title').textContent).toBe(
      'account_empty_title',
    )
    expect(container.querySelector('.no-match .hint').textContent).toBe(
      'account_empty_hint',
    )
    expect(window.dataLayer).toEqual([
      {
        page_path: '/accounts/',
        event: 'not_found',
        network: 'mainnet',
        description: 'account_empty_title -- account_empty_hint',
      },
    ])
  })

  it('redirects legacy transactions page', async () => {
    const id =
      '50BB0CC6EFC4F5EF9954E654D3230D4480DC83907A843C736B28420C7F02F774'
    renderApp(`/#/transactions/${id}`)
    await waitFor(() => {
      expect(document.title).toEqual(
        `xrpl_explorer | transaction_short 50BB0CC6...`,
      )
    })
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

  it('redirects legacy account page', async () => {
    const id = 'rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb'
    renderApp(`/#/graph/${id}#ssss`)
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | rKV8HEL3vLc6...`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/accounts/rKV8HEL3vLc6q9waTiJcewdRdSFyx67QFb#ssss',
        page_title: 'xrpl_explorer | rKV8HEL3vLc6...',
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
  })

  it('redirects legacy account page with no account', async () => {
    renderApp(`/#/graph/`)
    await waitFor(() => {
      expect(document.title).toEqual(`xrpl_explorer | ledgers`)
    })
    expect(window.dataLayer).toEqual([
      {
        page_path: '/',
        page_title: 'xrpl_explorer | ledgers',
        event: 'screen_view',
        network: 'mainnet',
      },
    ])
  })

  it('renders custom mode homepage', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST
    const { container } = renderApp('/')
    await flushPromises()
    expect(container.querySelector('header')).toHaveClass('header-no-network')
    expect(XrplClient).toHaveBeenCalledTimes(0)
    expect(document.title).toEqual(`xrpl_explorer`)
  })

  it('renders custom mode ledgers without trailing slash', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST

    delete process.env.VITE_CUSTOMNETWORK_LINK
    process.env.VITE_CUSTOMNETWORK_LINK = 'https://custom.xrpl.org'

    const network = 's2.ripple.com'
    const { container } = renderApp(`/${network}/`)
    await flushPromises()
    expect(container.querySelector('header')).not.toHaveClass(
      'header-no-network',
    )
    expect(XrplClient).toHaveBeenCalledTimes(1)
    expect(document.title).toEqual(`xrpl_explorer | ledgers`)
  })

  it('renders custom mode ledgers with trailing slash', async () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    delete process.env.VITE_P2P_RIPPLED_HOST

    delete process.env.VITE_CUSTOMNETWORK_LINK
    process.env.VITE_CUSTOMNETWORK_LINK = 'https://custom.xrpl.org/'

    const network = 's2.ripple.com'
    const { container } = renderApp(`/${network}/`)
    await flushPromises()
    expect(container.querySelector('header')).not.toHaveClass(
      'header-no-network',
    )
    expect(XrplClient).toHaveBeenCalledTimes(1)
    expect(document.title).toEqual(`xrpl_explorer | ledgers`)
  })
})
