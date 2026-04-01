import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { HeldIOUs } from '../assetTables/HeldIOUs'
import {
  getBalances,
  getAccountLines,
  getAccountInfo,
} from '../../../../rippled/lib/rippled'
import { formatTransferFee } from '../../../../rippled/lib/utils'
import { queryClient } from '../../../shared/QueryClient'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled')
jest.mock('../../../../rippled/lib/utils')
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
const mockedGetAccountLines = getAccountLines as Mock
const mockedGetAccountInfo = getAccountInfo as Mock
const mockedFormatTransferFee = formatTransferFee as Mock
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

const mockBalancesResponse = {
  assets: {
    rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH: [
      { currency: 'USD', value: '100' },
      { currency: 'EUR', value: '50' },
    ],
    rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B: [{ currency: 'BTC', value: '0.001' }],
    rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w: [
      {
        currency:
          '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
        value: '1000',
      },
    ],
  },
}

const mockAccountLinesResponse = {
  lines: [
    {
      currency: 'USD',
      account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      balance: '100.50',
      freeze: false,
      freeze_peer: false,
    },
    {
      currency: 'EUR',
      account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      balance: '50.25',
      freeze: false,
      freeze_peer: false,
    },
    {
      currency: 'BTC',
      account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      balance: '0.001',
      freeze: true,
      freeze_peer: false,
    },
    {
      currency:
        '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
      account: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
      balance: '1000',
      freeze: false,
      freeze_peer: false,
    },
  ],
  marker: '',
}

const mockLOSTokenResponse = {
  tokens: [
    {
      currency: 'USD',
      issuer_account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      icon: 'https://example.com/usd-icon.png',
      issuer_name: 'Gatehub',
      price_usd: '1.00',
      asset_class: 'Currency',
    },
    {
      currency: 'EUR',
      issuer_account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      icon: 'https://example.com/eur-icon.png',
      issuer_name: 'Gatehub',
      price_usd: '1.10',
      asset_class: 'Currency',
    },
    {
      currency: 'BTC',
      issuer_account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      issuer_name: 'Bitstamp',
      price_usd: '45000.00',
      asset_class: 'Cryptocurrency',
    },
    {
      currency:
        '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
      issuer_account: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
      price_usd: '1.00',
      asset_class: 'RWA',
    },
  ],
}

const mockAccountInfo = {
  TransferRate: 1010000000, // 1% transfer fee
  Flags: 0,
  AMMID: undefined,
}

describe('HeldIOUs', () => {
  afterEach(() => {
    cleanup()
    queryClient.clear() // Clear React Query cache between tests
  })

  // Helper function to verify column headers
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Currency Code')).toBeInTheDocument()
    })
    expect(screen.getByText('Issuer')).toBeInTheDocument()
    expect(screen.getByText('Price (USD)')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('Balance (USD)')).toBeInTheDocument()
    expect(screen.getByText('Asset Class')).toBeInTheDocument()
    expect(screen.getByText('Transfer Fee')).toBeInTheDocument()
    expect(screen.getByText('Frozen')).toBeInTheDocument()
  }

  it('renders empty state when no IOUs are held', async () => {
    // Override the default mocks to return truly empty data
    mockedGetBalances.mockResolvedValueOnce({ assets: {} })
    mockedGetAccountLines.mockResolvedValueOnce({ lines: [], marker: '' })

    // Also mock the LOS token fetch to return empty tokens
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ tokens: [] }),
    } as Response)

    render(
      <TestWrapper>
        <HeldIOUs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed (this is the translated text)
    await waitFor(() => {
      expect(screen.getByText('No IOUs found')).toBeInTheDocument()
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VITE_LOS_URL = 'https://api.los.example.com'

    mockedFormatTransferFee.mockReturnValue('1.0%')
    mockedGetBalances.mockResolvedValue(mockBalancesResponse)
    mockedGetAccountLines.mockResolvedValue(mockAccountLinesResponse)

    // Set up getAccountInfo mock to handle different account types
    mockedGetAccountInfo.mockImplementation((_, accountId) => {
      if (accountId === 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w') {
        // LP token issuer - make it an AMM account by default make tokens starting with `03` LP tokens
        return Promise.resolve({
          TransferRate: undefined,
          Flags: 0,
          AMMID: 'AMMID123456',
        })
      }
      // Regular accounts
      return Promise.resolve(mockAccountInfo)
    })

    mockedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLOSTokenResponse),
    } as Response)
  })

  it('shows all tokens including token starting with `03` whose issuer is not an AMM account', async () => {
    // Override the mock to make `03` token issuer NOT an AMM account
    // Add a delay to simulate async checking and test progressive reveal
    mockedGetAccountInfo.mockImplementation((_, accountId): Promise<any> => {
      if (accountId === 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              TransferRate: 1020000000, // 2% transfer fee
              Flags: 0x00400000, // lsfGlobalFreeze
              AMMID: undefined, // This makes it NOT an AMM account
            })
          }, 100) // 100ms delay to simulate network request
        })
      }

      // Regular accounts - immediate response
      return Promise.resolve(mockAccountInfo)
    })

    render(
      <TestWrapper>
        <HeldIOUs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Wait for initial tokens to load (non-03 tokens)
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument()
    })

    // Get initial table rows (excluding header)
    let rows = screen.getAllByRole('row')
    let dataRows = rows.slice(1)

    // Initially, we should only have 3 tokens (USD, EUR, BTC)
    // The `03` token should be hidden until confirmed as non-LP
    expect(dataRows).toHaveLength(3)
    expect(
      screen.queryByText(
        '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
      ),
    ).not.toBeInTheDocument()

    // Now wait for the `03` token to appear after confirmation
    await waitFor(
      () => {
        expect(
          screen.getByText(
            '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
          ),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )

    // Get all table rows again (should now include the `03` token)
    rows = screen.getAllByRole('row')
    dataRows = rows.slice(1) // Skip header row

    // Verify we have 4 token rows (sorted by Balance USD descending)
    expect(dataRows).toHaveLength(4)

    // / Verify `03` non-lp token data in first row (highest balance USD: $1,000.00)
    const nonLPTokenRow = dataRows[0]
    expect(nonLPTokenRow).toHaveTextContent(
      '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
    )
    expect(nonLPTokenRow).toHaveTextContent('rLNaPoK...4dc6w')
    expect(nonLPTokenRow).toHaveTextContent('$1.00')
    expect(nonLPTokenRow).toHaveTextContent('1,000')
    expect(nonLPTokenRow).toHaveTextContent('$1,000.00')
    expect(nonLPTokenRow).toHaveTextContent('RWA')
    // Initial state shows -- for both transfer fee and frozen (no trustline freeze)
    const nonLPTokenPlaceholders = nonLPTokenRow.textContent?.match(/--/g) || []
    expect(nonLPTokenPlaceholders.length).toBe(2)

    // Verify USD token data in second row (highest balance USD: $100.50)
    const usdRow = dataRows[1]
    expect(usdRow).toHaveTextContent('USD')
    expect(usdRow).toHaveTextContent('Gatehub')
    expect(usdRow).toHaveTextContent('$1.00')
    expect(usdRow).toHaveTextContent('100.5')
    expect(usdRow).toHaveTextContent('$100.50')

    // Initial state shows -- for both transfer fee and frozen (no trustline freeze)
    const usdPlaceholders = usdRow.textContent?.match(/--/g) || []
    expect(usdPlaceholders.length).toBe(2)

    // Verify EUR token data in third row (second highest: $55.28)
    const eurRow = dataRows[2]
    expect(eurRow).toHaveTextContent('EUR')
    expect(eurRow).toHaveTextContent('Gatehub')
    expect(eurRow).toHaveTextContent('$1.10')
    expect(eurRow).toHaveTextContent('50.25')
    expect(eurRow).toHaveTextContent('$55.28')
    expect(eurRow).toHaveTextContent('Currency')
    // Initial state shows -- for both transfer fee and frozen (no trustline freeze)
    const eurPlaceholders = eurRow.textContent?.match(/--/g) || []
    expect(eurPlaceholders.length).toBe(2)

    // Verify BTC token data in fourth row (third highest: $45.00)
    const btcRow = dataRows[3]
    expect(btcRow).toHaveTextContent('BTC')
    expect(btcRow).toHaveTextContent('Bitstamp')
    expect(btcRow).toHaveTextContent('$45,000.00')
    expect(btcRow).toHaveTextContent('0.001')
    expect(btcRow).toHaveTextContent('$45.00')
    expect(btcRow).toHaveTextContent('Cryptocurrency')
    // BTC has trustline freeze in the account lines
    expect(btcRow).toHaveTextContent('Trustline')
    // Only 1 placeholder for transfer fee (frozen shows Trustline, not --)
    const btcPlaceholders = btcRow.textContent?.match(/--/g) || []
    expect(btcPlaceholders.length).toBe(1)
  })

  it('excludes LP tokens whose issuer is an AMM account', async () => {
    // Use the default mock setup where LP token issuer IS an AMM account (from beforeEach)

    render(
      <TestWrapper>
        <HeldIOUs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Wait for tokens to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument()
    })

    // Get all table rows (excluding header)
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1) // Skip header row

    // Verify we have 3 token rows (LP token excluded)
    expect(dataRows).toHaveLength(3)

    // Verify USD token data in first row (highest balance USD: $100.50)
    const usdRow = dataRows[0]
    expect(usdRow).toHaveTextContent('USD')
    expect(usdRow).toHaveTextContent('Gatehub')
    expect(usdRow).toHaveTextContent('$1.00')
    expect(usdRow).toHaveTextContent('100.5')
    expect(usdRow).toHaveTextContent('$100.50')
    expect(usdRow).toHaveTextContent('Currency')
    const usdPlaceholders = usdRow.textContent?.match(/--/g) || []
    expect(usdPlaceholders.length).toBe(2)

    // Verify EUR token data in second row (second highest: $55.28)
    const eurRow = dataRows[1]
    expect(eurRow).toHaveTextContent('EUR')
    expect(eurRow).toHaveTextContent('Gatehub')
    expect(eurRow).toHaveTextContent('$1.10')
    expect(eurRow).toHaveTextContent('50.25')
    expect(eurRow).toHaveTextContent('$55.28')
    expect(eurRow).toHaveTextContent('Currency')
    const eurPlaceholders = eurRow.textContent?.match(/--/g) || []
    expect(eurPlaceholders.length).toBe(2)

    // Verify BTC token data in third row (third highest: $45.00)
    const btcRow = dataRows[2]
    expect(btcRow).toHaveTextContent('BTC')
    expect(btcRow).toHaveTextContent('Bitstamp')
    expect(btcRow).toHaveTextContent('$45,000.00')
    expect(btcRow).toHaveTextContent('0.001')
    expect(btcRow).toHaveTextContent('$45.00')
    expect(btcRow).toHaveTextContent('Cryptocurrency')
    expect(btcRow).toHaveTextContent('Trustline')
    const btcPlaceholders = btcRow.textContent?.match(/--/g) || []
    expect(btcPlaceholders.length).toBe(1)

    // Verify LP token is NOT displayed
    expect(
      screen.queryByText(
        '03AD8B0558D3C1FC1E7B1C0A0DB0C88D904D500FFE68DE154997F9CC9C999999',
      ),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('rLNaPoK...4dc6w')).not.toBeInTheDocument()
    expect(screen.queryByText('1,000')).not.toBeInTheDocument()
  })
})
