import { mount } from 'enzyme'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { testQueryClient } from '../../../test/QueryClient'
import i18n from '../../../../i18n/testConfig'
import TokenHeader from '..'
import { getToken } from '../../../../rippled'
import Mock = jest.Mock
import { flushPromises } from '../../../test/utils'

const TEST_ADDRESS = 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv'
const TEST_CURRENCY = 'abc'

jest.mock('../../../../rippled', () => ({
  __esModule: true,
  getToken: jest.fn(),
}))

const mockedGetToken = getToken as Mock

describe('TokenHeader Actions', () => {
  jest.setTimeout(10000)

  const createWrapper = (account = TEST_ADDRESS, currency = TEST_CURRENCY) =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <TokenHeader accountId={account} currency={currency} />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  it('successful token header', async () => {
    mockedGetToken.mockImplementation(() =>
      Promise.resolve({
        obligations: '100',
        sequence: 2148991,
        reserve: 10,
        rate: undefined,
        domain: undefined,
        emailHash: undefined,
        flags: [],
        balance: '123456000',
        previousTxn:
          '6B6F2CA1633A22247058E988372BA9EFFFC5BF10212230B67341CA32DC9D4A82',
        previousLedger: 68990183,
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const values = wrapper.find('.info-container .values .value')
    expect(values).toHaveLength(5)
    expect(values.at(0)).toHaveText('\uE900123.456')
    expect(values.at(1)).toHaveText('\uE90010.00')
    expect(values.at(2)).toHaveText('2148991')
    expect(values.at(3)).toHaveText(TEST_ADDRESS)
    expect(values.at(4)).toHaveText('100.0000')

    wrapper.unmount()
  })

  it('server error', async () => {
    mockedGetToken.mockImplementation(() => Promise.reject())

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.header-container')).not.toExist()

    wrapper.unmount()
  })

  it('invalid ripple address', async () => {
    const wrapper = createWrapper('ZZZ', undefined)
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('.header-container')).not.toExist()

    wrapper.unmount()
  })
})
