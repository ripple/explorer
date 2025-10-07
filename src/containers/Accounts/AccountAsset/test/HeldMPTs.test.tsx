import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { HeldMPTs } from '../assetTables/HeldMPTs'
import {
  getAccountMPTs,
  getMPTIssuance,
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

const mockedGetAccountMPTs = getAccountMPTs as Mock
const mockedGetMPTIssuance = getMPTIssuance as Mock

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

const mockMPTsResponse = {
  account_objects: [
    {
      MPTokenIssuanceID: '000004C463C52827307480341125DA65C267105D00000001',
      MPTAmount: '1000000',
      Flags: 1, // lsfMPTLocked
    },
    {
      MPTokenIssuanceID: '000004C463C52827307480341125DA65C267105D00000002',
      MPTAmount: '500000',
      Flags: 0,
    },
    {
      MPTokenIssuanceID: '000004C463C52827307480341125DA65C267105D00000003',
      MPTAmount: '250000',
      Flags: 0,
    },
  ],
  marker: '',
}

const mockMPTIssuanceResponses = {
  '000004C463C52827307480341125DA65C267105D00000001': {
    node: {
      Issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      TransferFee: 5000,
      Flags: 0,
      MPTokenMetadata: {
        Ticker: 'USD',
        IssuerName: 'Gatehub',
        AssetClass: 'Stablecoin',
      },
    },
  },
  '000004C463C52827307480341125DA65C267105D00000002': {
    node: {
      Issuer: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
      TransferFee: 10000,
      Flags: 1, // lsfMPTLocked (Global)
      MPTokenMetadata: {
        Ticker: 'EUR',
        IssuerName: 'Bitstamp',
        AssetClass: 'Currency',
      },
    },
  },
  '000004C463C52827307480341125DA65C267105D00000003': {
    node: {
      Issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      TransferFee: 15000,
      Flags: 0,
      MPTokenMetadata: {
        Ticker: 'BTC',
        IssuerName: 'Kraken',
        AssetClass: 'Cryptocurrency',
      },
    },
  },
}

describe('HeldMPTs', () => {
  // Helper function to verify all column headers are displayed
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Token ID')).toBeInTheDocument()
    })
    expect(screen.getByText('Ticker')).toBeInTheDocument()
    expect(screen.getByText('Issuer')).toBeInTheDocument()
    expect(screen.getByText('Price (USD)')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('Balance (USD)')).toBeInTheDocument()
    expect(screen.getByText('Asset Class')).toBeInTheDocument()
    expect(screen.getByText('Transfer Fee')).toBeInTheDocument()
    expect(screen.getByText('Locked')).toBeInTheDocument()
  }

  afterEach(() => {
    cleanup()
    queryClient.clear()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockedGetAccountMPTs.mockResolvedValue(mockMPTsResponse)
    mockedGetMPTIssuance.mockImplementation((_, mptIssuanceId) => {
      const response =
        mockMPTIssuanceResponses[
          mptIssuanceId as keyof typeof mockMPTIssuanceResponses
        ]
      return Promise.resolve(response)
    })
  })

  it('renders empty state when no MPTs are held', async () => {
    mockedGetAccountMPTs.mockResolvedValueOnce({ account_objects: [] })

    render(
      <TestWrapper>
        <HeldMPTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed
    await waitFor(() => {
      expect(screen.getByText('No MPTs found')).toBeInTheDocument()
    })
  })

  it('handles error when getAccountMPTs fails', async () => {
    mockedGetAccountMPTs.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <HeldMPTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No MPTs found')).toBeInTheDocument()
    })
  })

  it('shows 3 held MPTs with all column values', async () => {
    render(
      <TestWrapper>
        <HeldMPTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Wait for MPTs to load
    await waitFor(() => {
      expect(screen.getByText('000004C463...5D00000001')).toBeInTheDocument()
    })

    // Get all table rows (excluding header)
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1) // Skip header row

    // Verify we have 3 MPT rows
    expect(dataRows).toHaveLength(3)

    // Verify USD MPT data in first row
    const usdRow = dataRows[0]
    expect(usdRow).toHaveTextContent('000004C463...5D00000001')
    expect(usdRow).toHaveTextContent('rN7n7ot...6fzRH') // issuer
    expect(usdRow).toHaveTextContent('1,000,000') // balance
    expect(usdRow).toHaveTextContent('5%') // transfer fee
    expect(usdRow).toHaveTextContent('Individual') // locked status

    // Verify EUR MPT data in second row
    const eurRow = dataRows[1]
    expect(eurRow).toHaveTextContent('000004C463...5D00000002')
    expect(eurRow).toHaveTextContent('rLNaPoK...4dc6w') // issuer
    expect(eurRow).toHaveTextContent('500,000') // balance
    expect(eurRow).toHaveTextContent('10%') // transfer fee
    expect(eurRow).toHaveTextContent('Global') // locked status

    // Verify BTC MPT data in third row
    const btcRow = dataRows[2]
    expect(btcRow).toHaveTextContent('000004C463...5D00000003')
    expect(btcRow).toHaveTextContent('rvYAfWj...bs59B') // issuer
    expect(btcRow).toHaveTextContent('250,000') // balance
    expect(btcRow).toHaveTextContent('15%') // transfer fee
    expect(btcRow).toHaveTextContent('--') // not locked

    // Verify FutureDataIcon appears for Ticker, Price (USD), Balance (USD), and Asset Class columns
    // Each MPT has 4 FutureDataIcons (ticker, price USD, balance USD, asset class) = 3 MPTs * 4 icons = 12 total
    const futureDataIcons = document.querySelectorAll('.future-data')
    expect(futureDataIcons).toHaveLength(12)
  })
})
