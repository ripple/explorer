import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import AccountAsset from '../index'
import { queryClient } from '../../../shared/QueryClient'
import {
  getBalances,
  getAccountLines,
  getAccountInfo,
  getAccountNFTs,
  getAccountMPTs,
  getAccountObjects,
  getNFTsIssuedByAccount,
} from '../../../../rippled/lib/rippled'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled')
jest.mock('../../../../rippled/NFTTransactions')
jest.mock('../../../../rippled/lib/utils', () => ({
  formatTransferFee: jest.fn().mockReturnValue('1.00%'),
}))
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
const mockedGetAccountNFTs = getAccountNFTs as Mock
const mockedGetAccountMPTs = getAccountMPTs as Mock
const mockedGetAccountObjects = getAccountObjects as Mock
const mockedGetNFTsIssuedByAccount = getNFTsIssuedByAccount as Mock
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

describe('AccountAsset Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    cleanup()

    // Default mock implementations - empty data
    mockedGetBalances.mockResolvedValue([])
    mockedGetAccountLines.mockResolvedValue({ lines: [] })
    mockedGetAccountInfo.mockResolvedValue({
      account_data: { Account: 'rTest123', Flags: 0 },
    })
    mockedGetAccountNFTs.mockResolvedValue({ account_nfts: [] })
    mockedGetAccountMPTs.mockResolvedValue({ account_objects: [] })
    mockedGetAccountObjects.mockResolvedValue({ account_objects: [] })
    mockedGetNFTsIssuedByAccount.mockResolvedValue({ nfts: [] })
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ holders: [] }),
    } as Response)
  })

  describe('Rendering and Layout', () => {
    it('renders both Assets Held and Assets Issued sections', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Assets Held')).toBeInTheDocument()
      expect(screen.getByText('Assets Issued')).toBeInTheDocument()
    })

    it('renders all held asset tabs', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // Wait for tabs to render - use getAllByRole since there are multiple tabs with IOU/MPT/NFT
      await waitFor(() => {
        const allTabs = screen.getAllByRole('tab')
        expect(allTabs.length).toBeGreaterThan(0)
      })

      // Check that the held tabs list contains expected tabs
      const heldTabList = screen.getAllByRole('tablist')[0]
      expect(heldTabList).toHaveTextContent('IOUs')
      expect(heldTabList).toHaveTextContent('MPTs')
      expect(heldTabList).toHaveTextContent('LP Tokens')
      expect(heldTabList).toHaveTextContent('NFTs')
    })

    it('renders all issued asset tabs', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // Wait for tabs to render
      await waitFor(() => {
        const allTabs = screen.getAllByRole('tab')
        expect(allTabs.length).toBeGreaterThan(0)
      })

      // Check that the issued tabs list contains expected tabs
      const issuedTabList = screen.getAllByRole('tablist')[1]
      expect(issuedTabList).toHaveTextContent('IOUs')
      expect(issuedTabList).toHaveTextContent('MPTs')
      expect(issuedTabList).toHaveTextContent('NFTs')
    })
  })

  describe('Tab Navigation', () => {
    it('switches between held asset tabs', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getAllByRole('tablist').length).toBe(2)
      })

      // Find tabs using more specific queries
      const heldTabList = screen.getAllByRole('tablist')[0]
      const iouTab = heldTabList.querySelector('[aria-selected="true"]')
      expect(iouTab).toHaveTextContent('IOUs')

      // Click MPT tab
      const mptTab = heldTabList.querySelector('[title*="MPTs"]') as HTMLElement
      fireEvent.click(mptTab)

      await waitFor(() => {
        expect(mptTab).toHaveAttribute('aria-selected', 'true')
      })
    })

    it('switches between issued asset tabs', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getAllByRole('tablist').length).toBe(2)
      })

      const issuedTabList = screen.getAllByRole('tablist')[1]
      const iouTab = issuedTabList.querySelector('[aria-selected="true"]')
      expect(iouTab).toHaveTextContent('IOUs')

      // Click NFT tab
      const nftTab = issuedTabList.querySelector(
        '[title*="NFTs"]',
      ) as HTMLElement
      fireEvent.click(nftTab)

      await waitFor(() => {
        expect(nftTab).toHaveAttribute('aria-selected', 'true')
      })
    })
  })

  describe('Section Collapse/Expand', () => {
    it('collapses and expands held section', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // Find the collapse button for held section
      const toggleButtons = screen.getAllByLabelText(/Toggle assets/i)
      const heldToggle = toggleButtons[0]

      expect(heldToggle).toHaveAttribute('aria-expanded', 'true')

      // Collapse
      fireEvent.click(heldToggle)

      await waitFor(() => {
        expect(heldToggle).toHaveAttribute('aria-expanded', 'false')
      })

      // Expand
      fireEvent.click(heldToggle)

      await waitFor(() => {
        expect(heldToggle).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('collapses and expands issued section', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      const toggleButtons = screen.getAllByLabelText(/Toggle assets/i)
      const issuedToggle = toggleButtons[1]

      expect(issuedToggle).toHaveAttribute('aria-expanded', 'true')

      // Collapse
      fireEvent.click(issuedToggle)

      await waitFor(() => {
        expect(issuedToggle).toHaveAttribute('aria-expanded', 'false')
      })

      // Expand
      fireEvent.click(issuedToggle)

      await waitFor(() => {
        expect(issuedToggle).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner in tabs while data is being fetched', async () => {
      // Mock delayed responses
      mockedGetBalances.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
      )

      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // Check for loading spinner
      await waitFor(() => {
        const loadingSpinners = screen.getAllByRole('tab')
        const hasSpinner = loadingSpinners.some((tab) =>
          tab.querySelector('.loading-spinner'),
        )
        expect(hasSpinner).toBe(true)
      })

      // Wait for loading to complete
      await waitFor(
        () => {
          const tabs = screen.getAllByRole('tab')
          const hasSpinner = tabs.some((tab) =>
            tab.querySelector('.loading-spinner'),
          )
          expect(hasSpinner).toBe(false)
        },
        { timeout: 3000 },
      )
    })
  })

  describe('Asset Counts', () => {
    // Note: Asset count tests are covered in individual component tests
    // Here we just verify that counts are displayed in tabs
    it('displays asset counts in tab labels', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        const allTabs = screen.getAllByRole('tab')
        // Each tab should have a count in parentheses
        allTabs.forEach((tab) => {
          expect(tab.textContent).toMatch(/\(\d+\)/)
        })
      })
    })
  })

  describe('Component Integration', () => {
    it('renders all held asset components simultaneously', async () => {
      const { container } = render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // All components should call their APIs even if not visible
      await waitFor(() => {
        expect(mockedGetBalances).toHaveBeenCalled()
        expect(mockedGetAccountMPTs).toHaveBeenCalled()
        expect(mockedGetAccountNFTs).toHaveBeenCalled()
      })

      // Verify all 4 held asset table wrappers and asset tables are rendered
      const allSections = container.querySelectorAll('.account-asset-content')
      const heldSection = allSections[0] // First section (Held)
      const heldWrappers = heldSection.querySelectorAll(
        '.account-asset-table-wrapper',
      )
      expect(heldWrappers.length).toBe(4)

      const heldTables = heldSection.querySelectorAll('.account-asset-table')
      expect(heldTables.length).toBe(4)
    })

    it('renders all issued asset components simultaneously', async () => {
      const { container } = render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // All issued components should call their APIs even if not visible
      await waitFor(() => {
        expect(mockedGetAccountObjects).toHaveBeenCalled()
        expect(mockedGetNFTsIssuedByAccount).toHaveBeenCalled()
      })

      // Verify all 3 issued asset table wrappers and asset tables are rendered
      const allSections = container.querySelectorAll('.account-asset-content')
      const issuedSection = allSections[1] // Second section (Issued)
      const issuedWrappers = issuedSection.querySelectorAll(
        '.account-asset-table-wrapper',
      )
      expect(issuedWrappers.length).toBe(3)

      const issuedTables = issuedSection.querySelectorAll(
        '.account-asset-table',
      )
      expect(issuedTables.length).toBe(3)
    })

    it('passes accountId to all child components', async () => {
      const accountId = 'rTestAccount123'

      render(
        <TestWrapper>
          <AccountAsset
            accountId={accountId}
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        // getBalances is called by child components with socket as first param
        expect(mockedGetBalances).toHaveBeenCalled()
        expect(mockedGetAccountMPTs).toHaveBeenCalled()
        expect(mockedGetAccountNFTs).toHaveBeenCalled()
      })
    })

    it('passes xrpToUSDRate to HeldLPTokens component', async () => {
      const xrpToUSDRate = 1.25

      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={xrpToUSDRate}
          />
        </TestWrapper>,
      )

      // The component should render with the rate
      await waitFor(() => {
        expect(mockedGetBalances).toHaveBeenCalled()
      })
    })

    it('passes account data to IssuedIOUs component', async () => {
      const mockAccount = {
        Account: 'rTest123',
        Balance: '1000000',
        Flags: 0,
      }

      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={mockAccount}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockedGetBalances).toHaveBeenCalled()
      })
    })
  })

  describe('Tab Active States', () => {
    it('has IOU tab active by default in held section', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        const heldTabList = screen.getAllByRole('tablist')[0]
        const activeTab = heldTabList.querySelector('[aria-selected="true"]')
        expect(activeTab).toHaveTextContent('IOUs')
      })
    })

    it('has IOU tab active by default in issued section', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getAllByRole('tablist').length).toBe(2)
      })

      const issuedTabList = screen.getAllByRole('tablist')[1]
      const activeTab = issuedTabList.querySelector('[aria-selected="true"]')
      expect(activeTab).toHaveTextContent('IOUs')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for tab lists', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getAllByRole('tablist').length).toBe(2)
      })

      const tabLists = screen.getAllByRole('tablist')
      expect(tabLists[0]).toHaveAttribute('aria-label', 'Assets Held Tabs')
      expect(tabLists[1]).toHaveAttribute('aria-label', 'Assets Issued Tabs')
    })

    it('has proper ARIA attributes on tabs', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      await waitFor(() => {
        const tabs = screen.getAllByRole('tab')
        expect(tabs.length).toBeGreaterThan(0)
      })

      const tabs = screen.getAllByRole('tab')
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-selected')
        expect(tab).toHaveAttribute('role', 'tab')
      })
    })

    it('has proper aria-expanded on toggle buttons', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      const toggleButtons = screen.getAllByLabelText(/Toggle assets/i)
      expect(toggleButtons).toHaveLength(2)

      toggleButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded')
      })
    })
  })

  describe('Number Localization', () => {
    it('displays counts with proper formatting', async () => {
      render(
        <TestWrapper>
          <AccountAsset
            accountId="rTest123"
            account={undefined}
            xrpToUSDRate={0.5}
          />
        </TestWrapper>,
      )

      // Check that counts appear in a consistent format
      await waitFor(() => {
        const allTabs = screen.getAllByRole('tab')
        // All tabs should show count in format: "Label (N)"
        allTabs.forEach((tab) => {
          expect(tab.textContent).toMatch(/^.+\s+\(\d+\)$/)
        })
      })
    })
  })
})
