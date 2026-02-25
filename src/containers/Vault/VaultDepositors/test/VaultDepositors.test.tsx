import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { VaultDepositors } from '../index'
import { fetchAllVaultDepositors } from '../api/depositors'
import Mock = jest.Mock

jest.mock('../api/depositors', () => ({
  fetchAllVaultDepositors: jest.fn(),
}))

jest.mock('../../../shared/analytics', () => ({
  useAnalytics: () => ({ trackException: jest.fn() }),
}))

jest.mock('../../../shared/hooks/useTokenToUSDRate', () => ({
  useTokenToUSDRate: () => ({ rate: 1.5, isAvailable: true, isLoading: false }),
}))

const mockedFetchAllDepositors = fetchAllVaultDepositors as Mock
const mockSocket = {} as any

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0, cacheTime: 0 } },
  })

const TestWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) => (
    <I18nextProvider i18n={i18n}>
      <Router>
        <SocketContext.Provider value={mockSocket}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SocketContext.Provider>
      </Router>
    </I18nextProvider>
  )

const shareMptId = 'TEST_MPT_ID'
const totalSupply = '1000000'
const assetsTotal = '500000'
const asset = { currency: 'XRP' }

// Generate mock depositors for pagination testing (PAGE_SIZE = 10)
const createMockDepositors = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    account: `rAccount${i + 1}`,
    balance: `${(100 - i) * 1000}`,
    percent: (100 - i) / 10,
    value_usd: (100 - i) * 100,
  }))

describe('VaultDepositors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockedFetchAllDepositors.mockReturnValue(new Promise(() => {}))
    render(
      <VaultDepositors
        shareMptId={shareMptId}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    expect(screen.getByText('Depositors')).toBeInTheDocument()
    expect(screen.getByAltText('Loading')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    mockedFetchAllDepositors.mockRejectedValue(new Error('API Error'))
    render(
      <VaultDepositors
        shareMptId={shareMptId}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    await waitFor(() => {
      expect(
        screen.getByText(/Unable to fetch depositors information/i),
      ).toBeInTheDocument()
    })
  })

  it('renders empty state when no depositors', async () => {
    mockedFetchAllDepositors.mockResolvedValue({
      depositors: [],
      totalDepositors: 0,
    })
    render(
      <VaultDepositors
        shareMptId={shareMptId}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    await waitFor(() => {
      expect(screen.getByText(/No depositors found/i)).toBeInTheDocument()
    })
  })

  it('renders depositors table with data', async () => {
    mockedFetchAllDepositors.mockResolvedValue({
      depositors: createMockDepositors(5),
      totalDepositors: 5,
    })
    render(
      <VaultDepositors
        shareMptId={shareMptId}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    await waitFor(() => {
      expect(screen.getByText('rAccount1')).toBeInTheDocument()
      expect(screen.getByText('rAccount5')).toBeInTheDocument()
    })
  })

  it('handles pagination when more than 10 depositors', async () => {
    // 15 depositors = 2 pages (10 + 5)
    mockedFetchAllDepositors.mockResolvedValue({
      depositors: createMockDepositors(15),
      totalDepositors: 15,
    })
    render(
      <VaultDepositors
        shareMptId={shareMptId}
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    // Page 1: first 10 depositors
    await waitFor(() => {
      for (let i = 1; i <= 10; i += 1) {
        expect(screen.getByText(`rAccount${i}`)).toBeInTheDocument()
      }
    })
    expect(screen.queryByText('rAccount11')).not.toBeInTheDocument()

    // Click page 2
    const page2Button = screen.getByRole('button', { name: '2' })
    fireEvent.click(page2Button)

    // Page 2: depositors 11-15
    await waitFor(() => {
      expect(screen.getByText('rAccount11')).toBeInTheDocument()
      expect(screen.getByText('rAccount15')).toBeInTheDocument()
    })
  })

  it('disables query when shareMptId is empty', () => {
    render(
      <VaultDepositors
        shareMptId=""
        totalSupply={totalSupply}
        assetsTotal={assetsTotal}
        asset={asset}
      />,
      { wrapper: TestWrapper(createQueryClient()) },
    )

    expect(mockedFetchAllDepositors).not.toHaveBeenCalled()
  })
})
