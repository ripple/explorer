import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { VaultDepositors } from '../index'
import { getMPTHolders } from '../../../../rippled/lib/rippled'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  getMPTHolders: jest.fn(),
}))

jest.mock('../../../shared/analytics', () => ({
  useAnalytics: () => ({ trackException: jest.fn() }),
}))

jest.mock('../../../shared/hooks/useTokenToUSDRate', () => ({
  useTokenToUSDRate: () => ({ rate: 1.5, isAvailable: true, isLoading: false }),
}))

const mockedGetMPTHolders = getMPTHolders as Mock
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
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </SocketContext.Provider>
      </Router>
    </I18nextProvider>
  )

const defaultProps = {
  shareMptId: 'TEST_MPT_ID',
  totalSupply: '1000000',
  assetsTotal: '500000',
  displayCurrency: 'USD',
  asset: { currency: 'XRP' },
}

const mockHolders = [
  { account: 'rAccount1', mpt_amount: '500000' },
  { account: 'rAccount2', mpt_amount: '300000' },
  { account: 'rAccount3', mpt_amount: '100000' },
  { account: 'rAccount4', mpt_amount: '50000' },
  { account: 'rAccount5', mpt_amount: '50000' },
]

const mockHoldersPage2 = [
  { account: 'rAccount6', mpt_amount: '25000' },
  { account: 'rAccount7', mpt_amount: '20000' },
]

describe('VaultDepositors', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockedGetMPTHolders.mockReturnValue(new Promise(() => {}))
    render(<VaultDepositors {...defaultProps} />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    expect(screen.getByText('Depositors')).toBeInTheDocument()
    expect(screen.getByAltText('Loading')).toBeInTheDocument()
  })

  it('renders error state', async () => {
    mockedGetMPTHolders.mockRejectedValue(new Error('API Error'))
    render(<VaultDepositors {...defaultProps} />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    await waitFor(() => {
      expect(
        screen.getByText(/Unable to fetch depositors information/i),
      ).toBeInTheDocument()
    })
  })

  it('renders empty state when no depositors', async () => {
    mockedGetMPTHolders.mockResolvedValue({ mpt_holders: [] })
    render(<VaultDepositors {...defaultProps} />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    await waitFor(() => {
      expect(screen.getByText(/No depositors found/i)).toBeInTheDocument()
    })
  })

  it('renders depositors table with data', async () => {
    mockedGetMPTHolders.mockResolvedValue({ mpt_holders: mockHolders })
    render(<VaultDepositors {...defaultProps} />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    await waitFor(() => {
      expect(screen.getByText('rAccount1')).toBeInTheDocument()
      expect(screen.getByText('rAccount2')).toBeInTheDocument()
    })
  })

  it('handles pagination with next/prev buttons', async () => {
    mockedGetMPTHolders
      .mockResolvedValueOnce({ mpt_holders: mockHolders, marker: 'page2marker' })
      .mockResolvedValueOnce({ mpt_holders: mockHoldersPage2 })

    render(<VaultDepositors {...defaultProps} />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    // Page 1: 5 holders displayed
    await waitFor(() => {
      expect(screen.getByText('rAccount1')).toBeInTheDocument()
      expect(screen.getByText('rAccount2')).toBeInTheDocument()
      expect(screen.getByText('rAccount3')).toBeInTheDocument()
      expect(screen.getByText('rAccount4')).toBeInTheDocument()
      expect(screen.getByText('rAccount5')).toBeInTheDocument()
    })

    // Page 1: prev disabled, next enabled
    const prevBtn = screen.getByText('<')
    const nextBtn = screen.getByText('>')
    expect(prevBtn).toBeDisabled()
    expect(nextBtn).not.toBeDisabled()

    // Go to next page
    fireEvent.click(nextBtn)

    // Page 2: different holders displayed
    await waitFor(() => {
      expect(screen.getByText('rAccount6')).toBeInTheDocument()
      expect(screen.getByText('rAccount7')).toBeInTheDocument()
    })

    // Page 2: prev enabled
    expect(prevBtn).not.toBeDisabled()
  })

  it('disables query when shareMptId is empty', () => {
    render(<VaultDepositors {...defaultProps} shareMptId="" />, {
      wrapper: TestWrapper(createQueryClient()),
    })

    expect(mockedGetMPTHolders).not.toHaveBeenCalled()
  })
})
