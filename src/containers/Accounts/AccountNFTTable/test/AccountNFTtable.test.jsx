import { mount } from 'enzyme'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { setImmediate } from 'timers'
import { getAccountNFTs } from '../../../../rippled/lib/rippled'
import { AccountNFTTable } from '../AccountNFTTable'
import i18n from '../../../../i18nTestConfig'
import { EmptyMessageTableRow } from '../../../shared/EmptyMessageTableRow'
import { testQueryClient } from '../../../test/QueryClient'

jest.mock('../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getAccountNFTs: jest.fn(),
}))

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

const mockedGetAccountNFTs = getAccountNFTs

const data = {
  account: 'rnuweigWrt8Jp1gBmKJT6VLxrVMSJSuu6G',
  account_nfts: [
    {
      Flags: 0,
      Issuer: 'rGymBL8Huct6euA8jtEcLagYXpRgQKh6EC',
      NFTokenID:
        '00000000AF460F0D7BC0F05B626E19498DF690E00C97080B0000099B00000000',
      NFTokenTaxon: 0,
      nft_serial: 0,
    },
  ],
  ledger_current_index: 21174400,
  validated: false,
}

describe('AccountNFTTable component', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  const createWrapper = () =>
    mount(
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <AccountNFTTable accountId={TEST_ACCOUNT_ID} />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  afterEach(() => {
    mockedGetAccountNFTs.mockReset()
  })

  it('should render a table of nfts', async () => {
    mockedGetAccountNFTs.mockReset()

    mockedGetAccountNFTs.mockImplementation(() => Promise.resolve(data))

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('tbody tr td').length).toEqual(3)
    expect(wrapper.find('.load-more-btn')).not.toExist()
    wrapper.unmount()
  })

  it('should handle load more', async () => {
    mockedGetAccountNFTs.mockReset()

    mockedGetAccountNFTs.mockImplementation(() =>
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
      `00000000AF460F0D7BC0F05B626E19498DF690E00C97080B0000099B00000000`,
    )
    expect(columns.at(1).text()).toEqual(`rGymBL8Huct6euA8jtEcLagYXpRgQKh6EC`)
    expect(columns.at(2).text()).toEqual(`0`)
    expect(wrapper.find('.load-more-btn')).toExist()
    wrapper.find('.load-more-btn').simulate('click')
    expect(mockedGetAccountNFTs.mock.calls[1][2]).toEqual('hello')
    wrapper.unmount()
  })

  it(`should handle no results`, async () => {
    mockedGetAccountNFTs.mockReset()

    mockedGetAccountNFTs.mockImplementation(() =>
      Promise.resolve({
        account: 'rnuweigWrt8Jp1gBmKJT6VLxrVMSJSuu6G',
        account_nfts: [],
        marker: 'hello',
        ledger_current_index: 21174400,
        validated: false,
      }),
    )

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find(EmptyMessageTableRow)).toExist()
    wrapper.unmount()
  })
})
