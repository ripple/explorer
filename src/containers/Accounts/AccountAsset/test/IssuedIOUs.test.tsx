import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { IssuedIOUs } from '../assetTables/IssuedIOUs'
import { getBalances } from '../../../../rippled/lib/rippled'
import { queryClient } from '../../../shared/QueryClient'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled')
jest.mock('../../../../rippled/lib/logger', () => ({
  __esModule: true,
  default: () => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }),
}))

global.fetch = jest.fn() as jest.Mock

const mockedGetBalances = getBalances as Mock
const mockedFetch = fetch as Mock

// Mock socket client
const mockSocket = {} as any

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
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

// Mock data for issued tokens (obligations)
const mockBalancesResponse = {
  obligations: {
    USD: '1000000.50',
    EUR: '500000.25',
    BTC: '50.001',
  },
}

// Mock LOS Token API response for issued tokens
const mockLOSTokenResponse = {
  tokens: [
    {
      currency: 'USD',
      issuer_account: 'rTest123',
      icon: 'https://example.com/usd-icon.png',
      price_usd: '1.00',
      number_of_trustlines: 15000,
      number_of_holders: 12500,
      supply: '1000000.50',
      // Missing asset_class to test placeholder
    },
    {
      currency: 'EUR',
      issuer_account: 'rTest123',
      icon: 'https://example.com/eur-icon.png',
      price_usd: '1.10',
      number_of_trustlines: 8500,
      number_of_holders: 7200,
      supply: '500000.25',
      asset_class: 'Currency',
    },
    {
      currency: 'BTC',
      issuer_account: 'rTest123',
      price_usd: '45000.00',
      number_of_trustlines: 2500,
      number_of_holders: 2100,
      supply: '50.001',
      asset_class: 'Cryptocurrency',
    },
  ],
}

// Mock account with transfer fee and global freeze
const mockAccount = {
  info: {
    rate: 1.5, // 1.5% transfer fee
    flags: ['lsfGlobalFreeze'],
  },
}

describe('IssuedIOUs', () => {
  // Helper function to verify all column headers are displayed
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Currency Code')).toBeInTheDocument()
    })
    expect(screen.getByText('Price (USD)')).toBeInTheDocument()
    expect(screen.getByText('Trustlines')).toBeInTheDocument()
    expect(screen.getByText('Holders')).toBeInTheDocument()
    expect(screen.getByText('Supply')).toBeInTheDocument()
    expect(screen.getByText('Asset Class')).toBeInTheDocument()
    expect(screen.getByText('Transfer Fee')).toBeInTheDocument()
    expect(screen.getByText('Frozen')).toBeInTheDocument()
  }

  afterEach(() => {
    cleanup()
    queryClient.clear() // Clear React Query cache between tests
  })

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VITE_LOS_URL = 'https://api.los.example.com'

    mockedGetBalances.mockResolvedValue(mockBalancesResponse)
    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLOSTokenResponse),
    } as Response)
  })

  it('handles error when getBalances fails', async () => {
    // Mock getBalances to throw an error
    mockedGetBalances.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <IssuedIOUs accountId="rTest123" account={mockAccount} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No IOUs found')).toBeInTheDocument()
    })
  })

  it('renders empty state when no IOUs are issued', async () => {
    // Override the default mocks to return empty obligations
    mockedGetBalances.mockResolvedValueOnce({ obligations: {} })

    render(
      <TestWrapper>
        <IssuedIOUs accountId="rTest123" account={mockAccount} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed (this is the translated text)
    await waitFor(() => {
      expect(screen.getByText('No IOUs found')).toBeInTheDocument()
    })
  })

  it('shows 3 issued tokens with all column values', async () => {
    render(
      <TestWrapper>
        <IssuedIOUs accountId="rTest123" account={mockAccount} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Wait for tokens to load
    await waitFor(() => {
      expect(screen.getByText('BTC')).toBeInTheDocument()
    })

    // Get all table rows (excluding header)
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1) // Skip header row

    // Verify we have 3 token rows (sorted by Price USD descending)
    expect(dataRows).toHaveLength(3)

    // Verify BTC token data in first row (highest price: $45,000.00)
    const btcRow = dataRows[0]
    expect(btcRow).toHaveTextContent('BTC')
    expect(btcRow).toHaveTextContent('$45,000.00') // price
    expect(btcRow).toHaveTextContent('2,500') // trustlines
    expect(btcRow).toHaveTextContent('2,100') // holders
    expect(btcRow).toHaveTextContent('50.001') // supply
    expect(btcRow).toHaveTextContent('Cryptocurrency') // asset class
    expect(btcRow).toHaveTextContent('1.5%') // transfer fee
    expect(btcRow).toHaveTextContent('Global') // frozen

    // Verify EUR token data in second row (second highest: $1.10)
    const eurRow = dataRows[1]
    expect(eurRow).toHaveTextContent('EUR')
    expect(eurRow).toHaveTextContent('$1.10') // price
    expect(eurRow).toHaveTextContent('8,500') // trustlines
    expect(eurRow).toHaveTextContent('7,200') // holders
    expect(eurRow).toHaveTextContent('500,000.25') // supply
    expect(eurRow).toHaveTextContent('Currency') // asset class
    expect(eurRow).toHaveTextContent('1.5%') // transfer fee
    expect(eurRow).toHaveTextContent('Global') // frozen

    // Verify USD token data in third row (lowest price: $1.00)
    const usdRow = dataRows[2]
    expect(usdRow).toHaveTextContent('USD')
    expect(usdRow).toHaveTextContent('$1.00') // price
    expect(usdRow).toHaveTextContent('15,000') // trustlines
    expect(usdRow).toHaveTextContent('12,500') // holders
    expect(usdRow).toHaveTextContent('1,000,000.5') // supply
    expect(usdRow).toHaveTextContent('--') // asset class
    expect(usdRow).toHaveTextContent('1.5%') // transfer fee
    expect(usdRow).toHaveTextContent('Global') // frozen
  })
})
