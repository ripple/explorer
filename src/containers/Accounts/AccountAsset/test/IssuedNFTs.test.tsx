import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { IssuedNFTs } from '../assetTables/IssuedNFTs'
import {
  getNFTsIssuedByAccount,
  getBuyNFToffers,
  getSellNFToffers,
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

const mockedGetNFTsIssuedByAccount = getNFTsIssuedByAccount as Mock
const mockedGetBuyNFToffers = getBuyNFToffers as Mock
const mockedGetSellNFToffers = getSellNFToffers as Mock

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

// Mock NFT data
const mockIssuedNFTsResponse = {
  nfts: [
    {
      nft_id:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000001',
      uri: Buffer.from('https://example.com/issued-nft1').toString('hex'),
      transfer_fee: 2500, // 2.5%
    },
    {
      nft_id:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000002',
      uri: Buffer.from('https://example.com/issued-nft2').toString('hex'),
      transfer_fee: 7500, // 7.5%
    },
    {
      nft_id:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000003',
      uri: '', // No URI
      transfer_fee: 12500, // 12.5%
    },
  ],
  marker: '',
}

// Mock offer data (XRP only - in drops, 1 XRP = 1,000,000 drops)
const mockSellOffersNFT1 = {
  offers: [
    { amount: '3000000' }, // 3 XRP
    { amount: '3500000' }, // 3.5 XRP
  ],
}

const mockBuyOffersNFT1 = {
  offers: [
    { amount: '2800000' }, // 2.8 XRP
    { amount: '2500000' }, // 2.5 XRP
  ],
}

const mockSellOffersNFT2 = {
  offers: [
    { amount: '8000000' }, // 8 XRP
  ],
}

const mockBuyOffersNFT2 = {
  offers: [
    { amount: '7500000' }, // 7.5 XRP
  ],
}

// NFT3 has no offers
const mockNoOffers = {
  offers: [],
}

describe('IssuedNFTs', () => {
  // Helper function to verify all column headers are displayed
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Token ID')).toBeInTheDocument()
    })
    expect(screen.getByText('URL')).toBeInTheDocument()
    expect(screen.getByText('Transfer Fee')).toBeInTheDocument()
    expect(screen.getByText('Lowest Ask')).toBeInTheDocument()
    expect(screen.getByText('Highest Bid')).toBeInTheDocument()
  }

  afterEach(() => {
    cleanup()
    queryClient.clear()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetNFTsIssuedByAccount.mockResolvedValue(mockIssuedNFTsResponse)
    mockedGetBuyNFToffers.mockImplementation(
      (_rippledSocket: any, nftId: string) => {
        if (nftId === mockIssuedNFTsResponse.nfts[0].nft_id) {
          return Promise.resolve(mockBuyOffersNFT1)
        }
        if (nftId === mockIssuedNFTsResponse.nfts[1].nft_id) {
          return Promise.resolve(mockBuyOffersNFT2)
        }
        return Promise.resolve(mockNoOffers)
      },
    )
    mockedGetSellNFToffers.mockImplementation(
      (_rippledSocket: any, nftId: string) => {
        if (nftId === mockIssuedNFTsResponse.nfts[0].nft_id) {
          return Promise.resolve(mockSellOffersNFT1)
        }
        if (nftId === mockIssuedNFTsResponse.nfts[1].nft_id) {
          return Promise.resolve(mockSellOffersNFT2)
        }
        return Promise.resolve(mockNoOffers)
      },
    )
  })

  it('renders empty state when no NFTs are issued', async () => {
    mockedGetNFTsIssuedByAccount.mockResolvedValueOnce({ nfts: [] })

    render(
      <TestWrapper>
        <IssuedNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed (no Issuer column for issued NFTs)
    await verifyColumnHeaders()

    // Check that the empty message is displayed
    await waitFor(() => {
      expect(screen.getByText('No NFTs found')).toBeInTheDocument()
    })
  })

  it('handles error when getNFTsIssuedByAccount fails', async () => {
    mockedGetNFTsIssuedByAccount.mockRejectedValueOnce(
      new Error('Network error'),
    )

    render(
      <TestWrapper>
        <IssuedNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No NFTs found')).toBeInTheDocument()
    })
  })

  it('shows 3 issued NFTs with all column values', async () => {
    render(
      <TestWrapper>
        <IssuedNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Verify "Issuer" column is NOT displayed for issued NFTs (showIssuer=false)
    expect(screen.queryByText('Issuer')).not.toBeInTheDocument()

    // Wait for NFTs to load
    await waitFor(() => {
      expect(screen.getByText('00081388F2...C000000001')).toBeInTheDocument()
    })

    // Get all table rows (excluding header)
    const rows = screen.getAllByRole('row')
    const dataRows = rows.slice(1) // Skip header row

    // Verify we have 3 NFT rows
    expect(dataRows).toHaveLength(3)

    // Verify NFT1 data in first row
    const nft1Row = dataRows[0]
    expect(nft1Row).toHaveTextContent('00081388F2...C000000001')
    expect(nft1Row).toHaveTextContent('https://example...issued-nft1')
    expect(nft1Row).toHaveTextContent('2.5%')

    // Verify NFT2 data in second row
    const nft2Row = dataRows[1]
    expect(nft2Row).toHaveTextContent('00081388F2...C000000002')
    expect(nft2Row).toHaveTextContent('https://example...issued-nft2')
    expect(nft2Row).toHaveTextContent('7.5%')

    // Verify NFT3 data in third row
    const nft3Row = dataRows[2]
    expect(nft3Row).toHaveTextContent('00081388F2...C000000003')
    expect(nft3Row).toHaveTextContent('12.5%')

    // Verify offer data (async loaded)
    // XRP symbol is \uE900, offers are formatted with localizeNumber with currency: 'XRP'
    await waitFor(() => {
      expect(nft1Row.textContent).toContain('\uE9003.00') // Lowest Ask for NFT1
    })
    expect(nft1Row.textContent).toContain('\uE9002.80') // Highest Bid for NFT1

    // NFT2 offers
    expect(nft2Row.textContent).toContain('\uE9008.00') // Lowest Ask for NFT2
    expect(nft2Row.textContent).toContain('\uE9007.50') // Highest Bid for NFT2

    // NFT3: No offers, should show --
    const nft3Placeholders = nft3Row.textContent?.match(/--/g) || []
    expect(nft3Placeholders.length).toBeGreaterThanOrEqual(2) // At least 2: Lowest Ask and Highest Bid (no URL is also --)
  })
})
