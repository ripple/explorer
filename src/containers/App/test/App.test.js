import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import { AppWrapper } from '../index'
import MockWsClient from '../../test/mockWsClient'
import { getAccountInfo } from '../../../rippled/lib/rippled'

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

jest.mock('../../shared/SocketContext', () => {
  const originalModule = jest.requireActual('../../shared/SocketContext')

  return {
    __esModule: true,
    ...originalModule,
    getSocket: () => new MockWsClient(),
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

const mockGetAccountInfo = getAccountInfo

describe('App container', () => {
  const mockStore = configureMockStore()
  const createWrapper = (path = '/') => {
    const store = mockStore(initialState)
    return mount(
      <MemoryRouter initialEntries={[path]}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <AppWrapper />
          </Provider>
        </I18nextProvider>
      </MemoryRouter>,
    )
  }

  const oldEnvs = process.env

  beforeEach(() => {
    mockGetAccountInfo.mockImplementation(() =>
      Promise.resolve({
        flags: 0,
      }),
    )
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
      wrapper.unmount()
    })
  })

  it('renders ledger explorer page', () => {
    const wrapper = createWrapper('/ledgers')
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers')
      wrapper.unmount()
    })
  })

  it('renders not found page', () => {
    const wrapper = createWrapper('/zzz')
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | not_found_default_title')
      wrapper.unmount()
    })
  })

  it('renders ledger page', () => {
    const id = 12345
    const wrapper = createWrapper(`/ledgers/${id}`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ledger ${id}`)
      wrapper.unmount()
    })
  })

  it('renders transaction page', () => {
    const id = 12345
    const wrapper = createWrapper(`/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(
        `xrpl_explorer | transaction_short ${id}...`,
      )
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
      wrapper.unmount()
    })
  })

  it('renders account page for classic address', () => {
    const id = 'rZaChweF5oXn'
    const wrapper = createWrapper(`/accounts/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`)
      wrapper.unmount()
    })
  })

  it('renders account page for x-address', () => {
    const id = 'XVVFXHFdehYhofb7XRWeJYV6kjTEwboaHpB9S1ruYMsuXcG'
    const wrapper = createWrapper({}, `/accounts/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | XVVFXHFdehYh...`)
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
      wrapper.unmount()
    })
  })

  it('redirects legacy transactions page', () => {
    const id = 12345
    const wrapper = createWrapper(`/#/transactions/${id}`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(
        `xrpl_explorer | transaction_short ${id}...`,
      )
      wrapper.unmount()
    })
  })

  it('redirects legacy account page', () => {
    const id = 'rZaChweF5oXn'
    const wrapper = createWrapper(`/#/graph/${id}#ssss`)
    return new Promise((r) => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`)
      wrapper.unmount()
    })
  })
})
