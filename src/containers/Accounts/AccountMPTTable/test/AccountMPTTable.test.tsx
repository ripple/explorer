import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { QueryClientProvider } from 'react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { getAccountMPTs } from '../../../../rippled/lib/rippled'
import { AccountMPTTable } from '../AccountMPTTable'
import i18n from '../../../../i18n/testConfig'
import { testQueryClient } from '../../../test/QueryClient'
import { flushPromises } from '../../../test/utils'

import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getAccountMPTs: jest.fn(),
}))

const mockedGetAccountMPTs = getAccountMPTs as Mock

const data = {
  account: 'rw6UtpfBFaGht6SiC1HpDPNw6Yt25pKvnu',
  account_objects: [
    {
      Account: 'rw6UtpfBFaGht6SiC1HpDPNw6Yt25pKvnu',
      Flags: 0,
      LedgerEntryType: 'MPToken',
      MPTAmount: '100',
      MPTokenIssuanceID: '000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6',
      OwnerNode: '0',
      PreviousTxnID:
        '98646C9E7C6D7B8461DC92712B83EFF6CDA4203CE3FF3FF7E0B86FD57907949F',
      PreviousTxnLgrSeq: 969,
      index: '3BAA73912496683A414494218D3CCA33D02F80D588F80C1257C691448E00E486',
    },
  ],
  ledger_current_index: 970,
  status: 'success',
  validated: false,
}

describe('AccountMPTTable component', () => {
  const TEST_ACCOUNT_ID = 'rTEST_ACCOUNT'

  afterEach(cleanup)

  const renderComponent = () =>
    render(
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

    renderComponent()
    await flushPromises()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('should handle load more', async () => {
    mockedGetAccountMPTs.mockReset()

    mockedGetAccountMPTs.mockImplementation(() =>
      Promise.resolve({
        ...data,
        marker: 'hello',
      }),
    )

    renderComponent()
    await flushPromises()

    expect(screen.queryByRole('button')).toBeDefined()
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockedGetAccountMPTs.mock.calls[1][2]).toEqual('hello')
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

    renderComponent()
    await flushPromises()

    expect(screen.queryByTestId('empty-message')).toBeDefined()
  })
})
