import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { HeldNFTs } from '../assetTables/HeldNFTs'
import {
  getAccountNFTs,
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

const mockedGetAccountNFTs = getAccountNFTs as Mock
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
const mockNFTsResponse = {
  account_nfts: [
    {
      NFTokenID:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000001',
      Issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      URI: Buffer.from('https://example.com/nft1').toString('hex'),
      TransferFee: 5000, // 5%
    },
    {
      NFTokenID:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000002',
      Issuer: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
      URI: Buffer.from('https://example.com/nft2').toString('hex'),
      TransferFee: 10000, // 10%
    },
    {
      NFTokenID:
        '00081388F2C3F5B05AD6C8C0F5C0F5C0F5C0F5C0F5C0F5C0F5C0F5C000000003',
      Issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      URI: '', // No URI
      TransferFee: 15000, // 15%
    },
  ],
  marker: '',
}

// Mock offer data (XRP only - in drops, 1 XRP = 1,000,000 drops)
const mockSellOffersNFT1 = {
  offers: [
    { amount: '5000000' }, // 5 XRP
    { amount: '6000000' }, // 6 XRP
  ],
}

const mockBuyOffersNFT1 = {
  offers: [
    { amount: '4500000' }, // 4.5 XRP
    { amount: '4000000' }, // 4 XRP
  ],
}

const mockSellOffersNFT2 = {
  offers: [
    { amount: '10000000' }, // 10 XRP
  ],
}

const mockBuyOffersNFT2 = {
  offers: [
    { amount: '9500000' }, // 9.5 XRP
  ],
}

// NFT3 has no offers
const mockNoOffers = {
  offers: [],
}

describe('HeldNFTs', () => {
  // Helper function to verify all column headers are displayed
  const verifyColumnHeaders = async () => {
    await waitFor(() => {
      expect(screen.getByText('Token ID')).toBeInTheDocument()
    })
    expect(screen.getByText('Issuer')).toBeInTheDocument()
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
    mockedGetAccountNFTs.mockResolvedValue(mockNFTsResponse)
    mockedGetBuyNFToffers.mockImplementation(
      (_rippledSocket: any, nftId: string) => {
        if (nftId === mockNFTsResponse.account_nfts[0].NFTokenID) {
          return Promise.resolve(mockBuyOffersNFT1)
        }
        if (nftId === mockNFTsResponse.account_nfts[1].NFTokenID) {
          return Promise.resolve(mockBuyOffersNFT2)
        }
        return Promise.resolve(mockNoOffers)
      },
    )
    mockedGetSellNFToffers.mockImplementation(
      (_rippledSocket: any, nftId: string) => {
        if (nftId === mockNFTsResponse.account_nfts[0].NFTokenID) {
          return Promise.resolve(mockSellOffersNFT1)
        }
        if (nftId === mockNFTsResponse.account_nfts[1].NFTokenID) {
          return Promise.resolve(mockSellOffersNFT2)
        }
        return Promise.resolve(mockNoOffers)
      },
    )
  })

  it('renders empty state when no NFTs are held', async () => {
    mockedGetAccountNFTs.mockResolvedValueOnce({ account_nfts: [] })

    render(
      <TestWrapper>
        <HeldNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Check that the empty message is displayed
    await waitFor(() => {
      expect(screen.getByText('No NFTs found')).toBeInTheDocument()
    })
  })

  it('handles error when getAccountNFTs fails', async () => {
    mockedGetAccountNFTs.mockRejectedValueOnce(new Error('Network error'))

    render(
      <TestWrapper>
        <HeldNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

    // Should show empty state when error occurs
    await waitFor(() => {
      expect(screen.getByText('No NFTs found')).toBeInTheDocument()
    })
  })

  it('shows 3 held NFTs with all column values', async () => {
    render(
      <TestWrapper>
        <HeldNFTs accountId="rTest123" />
      </TestWrapper>,
    )

    // Verify all column headers are displayed
    await verifyColumnHeaders()

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
    expect(nft1Row).toHaveTextContent('rN7n7ot...6fzRH')
    expect(nft1Row).toHaveTextContent('https://example.com/nft1')
    expect(nft1Row).toHaveTextContent('5%')

    // Verify NFT2 data in second row
    const nft2Row = dataRows[1]
    expect(nft2Row).toHaveTextContent('00081388F2...C000000002')
    expect(nft2Row).toHaveTextContent('rLNaPoK...4dc6w')
    expect(nft2Row).toHaveTextContent('https://example.com/nft2')
    expect(nft2Row).toHaveTextContent('10%')

    // Verify NFT3 data in third row
    const nft3Row = dataRows[2]
    expect(nft3Row).toHaveTextContent('00081388F2...C000000003')
    expect(nft3Row).toHaveTextContent('rvYAfWj...bs59B')
    expect(nft3Row).toHaveTextContent('15%')

    // Verify offer data (async loaded)
    // XRP symbol is \uE900, offers are formatted with localizeNumber with currency: 'XRP'
    await waitFor(() => {
      expect(nft1Row.textContent).toContain('\uE9005.00') // Lowest Ask for NFT1
    })
    expect(nft1Row.textContent).toContain('\uE9004.50') // Highest Bid for NFT1

    // NFT2 offers
    expect(nft2Row.textContent).toContain('\uE90010.00') // Lowest Ask for NFT2
    expect(nft2Row.textContent).toContain('\uE9009.50') // Highest Bid for NFT2

    // NFT3: No offers, should show --
    const nft3Placeholders = nft3Row.textContent?.match(/--/g) || []
    expect(nft3Placeholders.length).toBeGreaterThanOrEqual(2) // At least 2: Lowest Ask and Highest Bid (no URL is also --)
  })
})
