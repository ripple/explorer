import { mount } from 'enzyme'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { getAccountMPTs } from '../../../../rippled/lib/rippled'
import { AccountMPTTable } from '../AccountMPTTable'
import i18n from '../../../../i18n/testConfig'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises } from '../../../test/utils'
import { encodeAccountID } from 'ripple-address-codec'
import { hexToBytes } from '@xrplf/isomorphic/utils'

import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getAccountMPTs: jest.fn(),
}))

const mockedGetAccountMPTs = getAccountMPTs as Mock

const data = {
  account: 'rLEr9C6kwybj1BFE1iYbhJXNFVz8rnLu8C',
  account_objects: [
    {
      Account: 'rLEr9C6kwybj1BFE1iYbhJXNFVz8rnLu8C',
      Flags: 0,
      LedgerEntryType: 'MPToken',
      MPTAmount: '64',
      MPTokenIssuanceID: '000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6',
      OwnerNode: '0',
      PreviousTxnID:
        '9B1E307299B48E2FB183CC23A6D070DCB5F2E170AE57A536E3F809D37F831688',
      PreviousTxnLgrSeq: 6086,
      index: '998FE89705D92481338C9EE24AD7B77AB84E2517AC2EBB32B2B7CBB094D17093',
    },
  ],
  ledger_hash:
    '7CC58622B7071E675AF63F39AAF81BDB4E87FDFEBB0BA8CE7D753F3C702D2886',
  ledger_index: 6086,
  validated: true,
}

describe('AccountMPTTable component', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const createWrapper = () =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <AccountMPTTable accountId={TEST_ACCOUNT_ID} />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  afterEach(() => {
    mockedGetAccountMPTs.mockReset()
  })

  it('should render a table of mpts', async () => {
    mockedGetAccountMPTs.mockReset()

    mockedGetAccountMPTs.mockImplementation(() => Promise.resolve(data))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('tbody tr td').length).toEqual(3)
    expect(wrapper.find('.load-more-btn')).not.toExist()
    wrapper.unmount()
  })

  it('should handle load more', async () => {
    mockedGetAccountMPTs.mockReset()

    mockedGetAccountMPTs.mockImplementation(() =>
      Promise.resolve({
        ...data,
        marker: 'hello',
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    const columns = wrapper.find('tbody tr td')
    expect(columns.at(0).text()).toEqual(
      `000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6`,
    )
    expect(columns.at(1).text()).toEqual(
      encodeAccountID(
        hexToBytes(data.account_objects[0].MPTokenIssuanceID.substring(8, 48)),
      ),
    )
    expect(columns.at(2).text()).toEqual(`100`)
    expect(wrapper.find('.load-more-btn')).toExist()
    wrapper.find('.load-more-btn').simulate('click')
    expect(mockedGetAccountMPTs.mock.calls[1][2]).toEqual('hello')
    wrapper.unmount()
  })

  it(`should handle no results`, async () => {
    mockedGetAccountMPTs.mockReset()

    mockedGetAccountMPTs.mockImplementation(() =>
      Promise.resolve({
        account: 'rLEr9C6kwybj1BFE1iYbhJXNFVz8rnLu8C',
        account_objects: [],
        ledger_hash:
          '7CC58622B7071E675AF63F39AAF81BDB4E87FDFEBB0BA8CE7D753F3C702D2886',
        ledger_index: 6086,
        validated: true,
        marker: 'hello',
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(EmptyMessageTableRow)).toExist()
    wrapper.unmount()
  })
})
