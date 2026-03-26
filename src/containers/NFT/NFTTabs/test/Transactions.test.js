import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { useInfiniteQuery, QueryClientProvider } from 'react-query'
import { Transactions } from '../Transactions'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useInfiniteQuery: jest.fn(),
}))

describe('NFT Offers container', () => {
  const renderTransactions = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Transactions tokenId="0008000053CB74A272C39586ACD55AEC7594A05003AB08830000099B00000000" />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>,
    )

  it('renders without crashing', () => {
    useInfiniteQuery.mockImplementation(() => ({
      data: {},
      isFetching: false,
      error: {},
    }))
    const { container } = renderTransactions()
    expect(container.querySelectorAll('.transaction-table').length).toEqual(1)
  })
})
