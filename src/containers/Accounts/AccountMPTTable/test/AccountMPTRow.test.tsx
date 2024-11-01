import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { render, screen, cleanup } from '@testing-library/react'
import { QueryClientProvider } from 'react-query'
import { AccountMPTRow } from '../AccountMPTTable'
import i18n from '../../../../i18n/testConfig'
import { testQueryClient } from '../../../test/QueryClient'
import { getMPTIssuance } from '../../../../rippled/lib/rippled'
import { flushPromises } from '../../../test/utils'

import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  __esModule: true,
  getMPTIssuance: jest.fn(),
}))

const mockedFetMPTIssuance = getMPTIssuance as Mock

const mptData = {
  account: 'rw6UtpfBFaGht6SiC1HpDPNw6Yt25pKvnu',
  flags: [],
  mptIssuanceID: '000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6',
  mptIssuer: 'rKFgd9FNzwu7a7iVYa2Me4dmBC3zzUepSC',
  mptAmount: '100',
}

describe('AccountMPTRow', () => {
  const renderComponent = (component: JSX.Element) =>
    render(
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>{component}</BrowserRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  afterEach(cleanup)
  it('handles Account MPT row', async () => {
    const issuanceData = {
      node: {
        AssetScale: 3,
      },
    }

    mockedFetMPTIssuance.mockReset()

    mockedFetMPTIssuance.mockImplementation(() =>
      Promise.resolve({ ...issuanceData }),
    )

    renderComponent(<AccountMPTRow mpt={mptData} />)
    await flushPromises()

    const elements = screen.getAllByRole('cell')

    expect(elements[0].outerHTML).toBe(
      '<td><a title="000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6" class="" href="/mpt/000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6">000017C2CE76E3E3328AE9E0D80CDD68BA72CC8D8D053DB6</a></td>',
    )
    expect(elements[1].outerHTML).toBe(
      '<td><a data-testid="account" title="rKFgd9FNzwu7a7iVYa2Me4dmBC3zzUepSC" class="account" href="/accounts/rKFgd9FNzwu7a7iVYa2Me4dmBC3zzUepSC">rKFgd9FNzwu7a7iVYa2Me4dmBC3zzUepSC</a></td>',
    )
    expect(elements[2].outerHTML).toBe('<td class="right">0.100</td>')
  })
})
