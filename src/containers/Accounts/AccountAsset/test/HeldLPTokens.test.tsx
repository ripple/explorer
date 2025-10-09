import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { HeldLPTokens } from '../assetTables/HeldLPTokens'
import {
  getBalances,
  getAMMInfoByAMMAccount,
} from '../../../../rippled/lib/rippled'
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

const mockedGetBalances = getBalances as Mock
const mockedGetAMMInfoByAMMAccount = getAMMInfoByAMMAccount as Mock

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

// Mock data for LP token balances (with LP token identifier prefix '03')
const mockBalancesResponseWithLPTokens = {
  assets: {
    rp9E3FN9YAJjc7xrr8eTTYVpBheop35uoxu8vM: [
      {
        currency:
          '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
        value: '1000.5',
      },
    ],
    rDMNE7xaqxZ6YqPMJJV6sJ7Bw5UjT3nT6vd4XW: [
      {
        currency:
          '03BD9C0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C888888',
        value: '500.25',
      },
    ],
  },
}

// Mock empty balances response
const mockEmptyBalancesResponse = {
  assets: {},
}

// Mock AMM info responses
const mockAMMInfoXRP = {
  amm: {
    amount: '50000000000', // 50,000 XRP (in drops)
    amount2: {
      currency: 'USD',
      issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      value: '50000',
    },
    lp_token: {
      currency:
        '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
      issuer: 'rp9E3FN9YAJjc7xrr8eTTYVpBheop35uoxu8vM',
      value: '10000',
    },
  },
}

const mockAMMInfoTokens = {
  amm: {
    amount: {
      currency: 'USD',
      issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      value: '25000',
    },
    amount2: {
      currency: 'EUR',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: '22727.27',
    },
    lp_token: {
      currency:
        '03BD9C0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C888888',
      issuer: 'rDMNE7xaqxZ6YqPMJJV6sJ7Bw5UjT3nT6vd4XW',
      value: '5000',
    },
  },
}

describe('HeldLPTokens', () => {
  const mockXRPToUSDRate = 0.5 // 1 XRP = $0.50

  // Helper function to verify column headers
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('AMM Instance')).toBeInTheDocument()
    })
    expect(screen.getByText('AMM Pair')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('Balance (USD)')).toBeInTheDocument()
    expect(screen.getByText('Share (%)')).toBeInTheDocument()
  }

  afterEach(() => {
    cleanup()
    queryClient.clear() // Clear React Query cache between tests
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockedGetBalances.mockResolvedValue(mockBalancesResponseWithLPTokens)

    // Set up getAMMInfoByAMMAccount mock to handle different AMM accounts
    mockedGetAMMInfoByAMMAccount.mockImplementation((_, ammAccount) => {
      if (ammAccount === 'rp9E3FN9YAJjc7xrr8eTTYVpBheop35uoxu8vM') {
        return Promise.resolve(mockAMMInfoXRP)
      }
      if (ammAccount === 'rDMNE7xaqxZ6YqPMJJV6sJ7Bw5UjT3nT6vd4XW') {
        return Promise.resolve(mockAMMInfoTokens)
      }
      return Promise.reject(new Error('AMM not found'))
    })
  })

  it('renders empty state when no LP tokens are held', async () => {
    // Override the default mock to return empty assets
    mockedGetBalances.mockResolvedValueOnce(mockEmptyBalancesResponse)

    render(
      <TestWrapper>
        <HeldLPTokens accountId="rTest123" xrpToUSDRate={mockXRPToUSDRate} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed (this is the translated text)
    await waitFor(() => {
      expect(screen.getByText('No LP Tokens found')).toBeInTheDocument()
    })
  })

  it('handles error when getBalances fails', async () => {
    // Mock getBalances to throw an error
    mockedGetBalances.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <HeldLPTokens accountId="rTest123" xrpToUSDRate={mockXRPToUSDRate} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No LP Tokens found')).toBeInTheDocument()
    })
  })

  it('shows two LP tokens with XRP pair and token pair', async () => {
    render(
      <TestWrapper>
        <HeldLPTokens accountId="rTest123" xrpToUSDRate={mockXRPToUSDRate} />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Wait for LP tokens to load
    await waitFor(() => {
      expect(screen.getByText('rp9E3FN...xu8vM')).toBeInTheDocument()
    })

    // Get all table rows (excluding header)
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1) // Skip header row

    // Verify we have 2 LP token rows (XRP pair first, then token pair)
    expect(dataRows).toHaveLength(2)

    // Verify first LP token (XRP/USD pair)
    const xrpUsdRow = dataRows[0]
    expect(xrpUsdRow).toHaveTextContent('rp9E3FN...xu8vM') // AMM instance
    expect(xrpUsdRow.textContent).toMatch(/XRP\/USD/) // AMM pair
    expect(xrpUsdRow).toHaveTextContent('1,000.5') // Balance
    expect(xrpUsdRow).toHaveTextContent('$5,002.50') // Balance USD
    expect(xrpUsdRow.textContent).toMatch(/10\.01/) // Share %

    // Verify second LP token (USD/EUR pair)
    const usdEurRow = dataRows[1]
    expect(usdEurRow).toHaveTextContent('rDMNE7x...vd4XW') // AMM instance
    expect(usdEurRow.textContent).toMatch(/USD\/EUR/) // AMM pair
    expect(usdEurRow).toHaveTextContent('500.25') // Balance
    expect(usdEurRow).toHaveTextContent('--') // Balance USD (no XRP in pair)
    expect(usdEurRow.textContent).toMatch(/10\.01/) // Share %
  })
})
