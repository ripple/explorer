import { render, screen, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { getAccountNFTs } from '../../../../rippled/lib/rippled'
import { AccountNFTTable } from '../AccountNFTTable'
import i18n from '../../../../i18n/testConfig'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises } from '../../../test/utils'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getAccountNFTs: jest.fn(),
}))

const mockedGetAccountNFTs = getAccountNFTs as Mock

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

  const renderComponent = () =>
    render(
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
    cleanup()
  })

  it('should render a table of nfts', async () => {
    mockedGetAccountNFTs.mockReset()

    mockedGetAccountNFTs.mockImplementation(() => Promise.resolve(data))

    renderComponent()
    await flushPromises()

    expect(screen.getAllByRole('cell').length).toEqual(3)
    expect(screen.queryByRole('button')).toBeDefined()
  })

  it('should handle load more', async () => {
    mockedGetAccountNFTs.mockReset()

    mockedGetAccountNFTs.mockImplementation(() =>
      Promise.resolve({
        ...data,
        marker: 'hello',
      }),
    )

    renderComponent()
    await flushPromises()

    const columns = screen.getAllByRole('cell')
    expect(columns[0]).toHaveTextContent(
      `00000000AF460F0D7BC0F05B626E19498DF690E00C97080B0000099B00000000`,
    )
    expect(columns[1]).toHaveTextContent(`rGymBL8Huct6euA8jtEcLagYXpRgQKh6EC`)
    expect(columns[2]).toHaveTextContent(`0`)
    expect(screen.getByRole('button')).toBeDefined()
    userEvent.click(screen.getByRole('button'))
    expect(mockedGetAccountNFTs.mock.calls[1][2]).toEqual('hello')
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

    renderComponent()
    await flushPromises()

    expect(screen.queryByTestId('empty-message')).toBeDefined()
  })
})
