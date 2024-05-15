import { mount } from 'enzyme'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { testQueryClient } from '../../../test/QueryClient'
import i18n from '../../../../i18n/testConfig'
import { AccountHeader } from '..'
import { getAccountState } from '../../../../rippled'
import Mock = jest.Mock
import { flushPromises } from '../../../test/utils'

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv'
const TEST_X_ADDRESS = 'XV3oNHx95sqdCkTDCBCVsVeuBmvh2dz5fTZvfw8UCcMVsfe'

jest.mock('../../../../rippled', () => ({
  __esModule: true,
  getAccountState: jest.fn(),
}))

const mockedGetAccountState = getAccountState as Mock

describe('AccountHeader Actions', () => {
  const createWrapper = (account = TEST_ADDRESS) =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <AccountHeader
              accountId={account}
              onSetCurrencySelected={jest.fn()}
              currencySelected="XRP"
            />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  beforeEach(() => {
    jest.resetModules()
  })

  it('successful account header', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve({
        account: TEST_ADDRESS,
        ledger_index: 68990183,
        info: {
          sequence: 2148991,
          ticketCount: undefined,
          ownerCount: 0,
          reserve: 10,
          tick: undefined,
          rate: undefined,
          domain: undefined,
          emailHash: undefined,
          flags: [],
          balance: '123456000',
          nftMinter: undefined,
          previousTxn:
            '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
          previousLedger: 68990183,
        },
        deleted: false,
        balances: { XRP: 123.456 },
        signerList: undefined,
        tokens: [],
        escrows: undefined,
        paychannels: null,
        xAddress: undefined,
        hasBridge: false,
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe(TEST_ADDRESS)

    wrapper.unmount()
  })

  it('account with tokens', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve({
        account: 'rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY',
        ledger_index: 72338736,
        info: {
          sequence: 1227,
          ticketCount: undefined,
          ownerCount: 28,
          reserve: 66,
          tick: undefined,
          rate: undefined,
          domain: undefined,
          emailHash: undefined,
          flags: [],
          balance: '1172875760329',
          previousTxn:
            '259A84CE4B3B09D5FBCAA133F62FC767CA2B57B3C64CF065F7546AA63D55E070',
          previousLedger: 67657581,
        },
        balances: {
          '0158415500000000C1F76FF6ECB0BAC600000000': 3.692385398244198,
          BTC: 1.075524263886059,
          CHF: 0.7519685210971255,
          CNY: 12.328638002,
          DYM: 95.13258522535791,
          EUR: 53.426387263174405,
          GBP: 79.51188949705619,
          JPY: 4986.30908732758,
          USD: 936.8290046958887,
          XAU: 3.419442510305086,
          XRP: 1172875.760329,
        },
        signerList: undefined,
        tokens: [
          {
            amount: 95.13258522535791,
            currency: 'DYM',
            issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
          },
          {
            amount: 20,
            currency: 'USD',
            issuer: 'rME7HanzUymzFvETpoLgAy5rvxGcKiLrYL',
          },
          {
            amount: 255.7836054268899,
            currency: 'USD',
            issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
          },
          {
            amount: 1.075524263886059,
            currency: 'BTC',
            issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
          },
          {
            amount: 12.328638002,
            currency: 'CNY',
            issuer: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK',
          },
          {
            amount: 3.419442510305086,
            currency: 'XAU',
            issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
          },
          {
            amount: 3.692385398244198,
            currency: '0158415500000000C1F76FF6ECB0BAC600000000',
            issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
          },
          {
            amount: 0.7519685210971255,
            currency: 'CHF',
            issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
          },
          {
            amount: 78.5098894970562,
            currency: 'GBP',
            issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
          },
          {
            amount: 4986.30908732758,
            currency: 'JPY',
            issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
          },
          {
            amount: 28.42638726317441,
            currency: 'EUR',
            issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
          },
        ],
        escrows: undefined,
        paychannels: null,
        xAddress: undefined,
        hasBridge: false,
        deleted: false,
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe(TEST_ADDRESS)
    expect(wrapper.find('.balance-selector-container')).toExist()
    expect(wrapper.find('.balance .value').text()).toBe('\uE9001,172,875.76')

    wrapper.unmount()
  })

  it('should dispatch correct actions on successful loadAccountState for X-Address', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve({
        account: TEST_ADDRESS,
        ledger_index: 68990183,
        info: {
          sequence: 2148991,
          ticketCount: undefined,
          ownerCount: 0,
          reserve: 10,
          tick: undefined,
          rate: undefined,
          domain: undefined,
          emailHash: undefined,
          flags: [],
          balance: '123456000',
          nftMinter: undefined,
          previousTxn:
            '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
          previousLedger: 68990183,
        },
        deleted: false,
        balances: { XRP: 123.456 },
        signerList: undefined,
        tokens: [],
        escrows: undefined,
        hasBridge: false,
        paychannels: null,
        xAddress: {
          classicAddress: TEST_ADDRESS,
          tag: 0,
          test: false,
        },
      }),
    )

    const wrapper = createWrapper(TEST_X_ADDRESS)
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe(TEST_X_ADDRESS)

    wrapper.unmount()
  })

  it('server error', async () => {
    mockedGetAccountState.mockImplementation(() => {})

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe(TEST_ADDRESS)
    expect(wrapper.find('.header-container')).not.toExist()

    wrapper.unmount()
  })

  it('should dispatch correct actions on invalid address', async () => {
    const wrapper = createWrapper('ZZZ')
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe('ZZZ')
    expect(wrapper.find('.header-container')).not.toExist()

    wrapper.unmount()
  })

  it('deleted account', async () => {
    mockedGetAccountState.mockImplementation(() =>
      Promise.resolve({
        account: TEST_ADDRESS,
        deleted: true,
        xAddress: undefined,
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('h1').text()).toBe(TEST_ADDRESS)
    expect(wrapper.find('.warning').find('.account-deleted-text').text()).toBe(
      'Account Deleted',
    )

    wrapper.unmount()
  })
})
