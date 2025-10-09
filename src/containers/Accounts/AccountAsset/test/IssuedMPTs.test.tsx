import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { IssuedMPTs } from '../assetTables/IssuedMPTs'
import { getAccountObjects } from '../../../../rippled/lib/rippled'
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

const mockedGetAccountObjects = getAccountObjects as Mock

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

const mockMPTIssuancesResponse = {
  account_objects: [
    {
      mpt_issuance_id: '000004C463C52827307480341125DA65C267105D00000001',
      OutstandingAmount: '1000000',
      TransferFee: 5000,
      Flags: 0,
      MPTokenMetadata: {
        Ticker: 'USD',
        AssetClass: 'Stablecoin',
      },
    },
    {
      mpt_issuance_id: '000004C463C52827307480341125DA65C267105D00000002',
      OutstandingAmount: '500000',
      TransferFee: 10000,
      Flags: 1, // lsfMPTLocked
      MPTokenMetadata: {
        Ticker: 'EUR',
        AssetClass: 'Currency',
      },
    },
    {
      mpt_issuance_id: '000004C463C52827307480341125DA65C267105D00000003',
      OutstandingAmount: '250000',
      TransferFee: 15000,
      Flags: 0,
      MPTokenMetadata: {
        Ticker: 'BTC',
        AssetClass: 'Cryptocurrency',
      },
    },
  ],
  marker: '',
}

describe('IssuedMPTs', () => {
  // Helper function to verify all column headers are displayed
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Token ID')).toBeInTheDocument()
    })
    expect(screen.getByText('Ticker')).toBeInTheDocument()
    expect(screen.getByText('Price (USD)')).toBeInTheDocument()
    expect(screen.getByText('Supply')).toBeInTheDocument()
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
    mockedGetAccountObjects.mockResolvedValue(mockMPTIssuancesResponse)
  })

  it('renders empty state when no MPTs are issued', async () => {
    mockedGetAccountObjects.mockResolvedValueOnce({ account_objects: [] })

    render(
      <TestWrapper>
        <IssuedMPTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed
    await waitFor(() => {
      expect(screen.getByText('No MPTs found')).toBeInTheDocument()
    })
  })

  it('handles error when getAccountObjects fails', async () => {
    mockedGetAccountObjects.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <IssuedMPTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No MPTs found')).toBeInTheDocument()
    })
  })

  it('shows 3 issued MPTs with all column values', async () => {
    render(
      <TestWrapper>
        <IssuedMPTs accountId="rTest123" />
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
    expect(usdRow).toHaveTextContent('1,000,000') // supply
    expect(usdRow).toHaveTextContent('5%') // transfer fee
    expect(usdRow).toHaveTextContent('--') // not locked

    // Verify EUR MPT data in second row
    const eurRow = dataRows[1]
    expect(eurRow).toHaveTextContent('000004C463...5D00000002')
    expect(eurRow).toHaveTextContent('500,000') // supply
    expect(eurRow).toHaveTextContent('10%') // transfer fee
    expect(eurRow).toHaveTextContent('Global') // locked

    // Verify BTC MPT data in third row
    const btcRow = dataRows[2]
    expect(btcRow).toHaveTextContent('000004C463...5D00000003')
    expect(btcRow).toHaveTextContent('250,000') // supply
    expect(btcRow).toHaveTextContent('15%') // transfer fee
    expect(btcRow).toHaveTextContent('--') // not locked

    // Verify FutureDataIcon appears for Ticker, Price (USD), and Asset Class columns
    // Each MPT has 3 FutureDataIcons (ticker, price, asset class) = 3 MPTs * 3 icons = 9 total
    const futureDataIcons = document.querySelectorAll('.future-data')
    expect(futureDataIcons).toHaveLength(9)
  })
})
