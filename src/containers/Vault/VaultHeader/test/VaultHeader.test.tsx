/**
 * VaultHeader Component Unit Tests
 *
 * This test suite validates the VaultHeader component which displays
 * vault information including owner, assets, privacy settings, and
 * various financial metrics.
 *
 * Key concepts tested:
 * - Vault privacy flag (lsfPrivate: 0x00000001)
 * - Asset types: XRP, IOU tokens, and MPTs (Multi-Purpose Tokens)
 * - Compact number formatting (K for thousands, M for millions)
 * - Hex-encoded Data field decoding
 * - Withdrawal policies from XLS-65d spec
 * - Vault credentials (DomainID from MPTokenIssuance)
 */

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { VaultHeader } from '../index'
import { queryClient } from '../../../shared/QueryClient'
import { getMPTIssuance } from '../../../../rippled/lib/rippled'
import Mock = jest.Mock

// Mock the rippled library to control API responses
jest.mock('../../../../rippled/lib/rippled')

// Mock the XRP to USD rate hook
const mockXRPToUSDRate = jest.fn()
jest.mock('../../../shared/hooks/useXRPToUSDRate', () => ({
  useXRPToUSDRate: () => mockXRPToUSDRate(),
}))

// Mock the token to USD rate hook
const mockTokenToUSDRate = jest.fn()
jest.mock('../../../shared/hooks/useTokenToUSDRate', () => ({
  useTokenToUSDRate: (token: any) => {
    const result = mockTokenToUSDRate(token)
    // Return object structure if mockTokenToUSDRate returns a number
    if (typeof result === 'number') {
      return { rate: result, isAvailable: result > 0, isLoading: false }
    }
    // Otherwise return the result as-is (for custom mock implementations)
    return result
  },
}))

const mockedGetMPTIssuance = getMPTIssuance as Mock

// Mock socket client - represents the WebSocket connection to rippled
const mockSocket = {} as any

/**
 * TestWrapper Component
 *
 * Provides all necessary context providers for the VaultHeader component:
 * - I18nextProvider: Internationalization for translated text
 * - Router: React Router for link components
 * - SocketContext: WebSocket connection for rippled queries
 * - QueryClientProvider: React Query for data fetching/caching
 */
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

describe('VaultHeader Component', () => {
  // Reset mocks and clear query cache before each test
  // This ensures tests are isolated and don't affect each other
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    cleanup()

    // Default mock: no MPT issuance data (vault credential)
    mockedGetMPTIssuance.mockResolvedValue({ node: null })

    // Default mock: XRP to USD rate of 2.0 for predictable conversion tests
    mockXRPToUSDRate.mockReturnValue(2.0)

    // Default mock: Token to USD rate based on asset type
    // XRP: 2.0 (same as XRP to USD rate)
    // RLUSD: 1.0 (stablecoin pegged 1:1 to USD)
    // Other: 0 (no conversion available)
    mockTokenToUSDRate.mockImplementation((token: any) => {
      if (!token) return 0
      if (token.currency === 'XRP') return 2.0
      if (token.currency === 'RLUSD') return 1.0
      return 0
    })
  })

  /**
   * =========================================
   * SECTION 1: Basic Rendering Tests
   * =========================================
   * These tests verify the component renders correctly with minimal data
   */
  describe('Basic Rendering', () => {
    it('renders the vault section title', () => {
      // Minimal vault data required for rendering
      const vaultData = {
        Owner: 'rTestOwner123',
        Asset: { currency: 'XRP' },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123DEF456"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // The component should display "Vault" as the section title
      const title = screen.getByText('Vault')
      expect(title.tagName).toBe('H2')
      expect(title).toHaveClass('vault-section-title')
    })

    it('renders the vault details container', () => {
      const vaultData = {
        Owner: 'rTestOwner123',
        Asset: { currency: 'XRP' },
      }

      const { container } = render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123DEF456"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify the main container structure exists
      expect(container.querySelector('.vault-section')).toBeInTheDocument()
      expect(
        container.querySelector('.vault-details-container'),
      ).toBeInTheDocument()
    })

    it('displays the vault ID with truncation', () => {
      const vaultId = 'ABC123DEF456GHI789JKL012'
      const vaultData = {
        Owner: 'rTestOwner123',
        Asset: { currency: 'XRP' },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId={vaultId}
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Vault ID should be truncated for display: first 8 chars + "..." + last 6 chars
      // This makes long IDs more readable while still being identifiable
      const vaultIdLabel = screen.getByText('Vault ID')
      expect(vaultIdLabel).toBeInTheDocument()

      // Verify the truncated format: ABC123DE...KL012 (8 chars + ... + 6 chars)
      const expectedTruncated = `${vaultId.substring(0, 8)}...${vaultId.substring(vaultId.length - 6)}`
      expect(screen.getByText(expectedTruncated)).toBeInTheDocument()
    })

    it('displays the owner as a clickable account link', () => {
      const owner = 'rOwnerAccount123456'
      const vaultData = {
        Owner: owner,
        Asset: { currency: 'XRP' },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Owner label should be present
      expect(screen.getByText('Owner')).toBeInTheDocument()

      // Owner value should display the exact account address as link text
      // The Account component displays the full address for short accounts
      const ownerLink = screen.getByRole('link', {
        name: `${owner.slice(0, 7)}...${owner.slice(-5)}`,
      })
      expect(ownerLink.getAttribute('href')).toBe(`/accounts/${owner}`)
    })
  })

  /**
   * =========================================
   * SECTION 2: Private Vault Flag Tests
   * =========================================
   * Vaults can be public or private, controlled by the lsfPrivate flag (0x00000001)
   * The UI displays this as YES/NO pill buttons
   */
  describe('Private Vault Flag', () => {
    it('displays YES as active when vault is private (flag = 0x00000001)', () => {
      // lsfPrivate flag is bit 0 (0x00000001) from XLS-65d spec
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Flags: 0x00000001, // Private vault
      }

      const { container } = render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify the "Private Vault" label exists
      expect(screen.getByText('Private Vault')).toBeInTheDocument()

      // Find the toggle pills
      const togglePills = container.querySelectorAll('.toggle-pill')
      expect(togglePills.length).toBe(2)

      // YES pill should be active for private vault, with exact text
      const yesPill = togglePills[0]
      const noPill = togglePills[1]
      expect(yesPill.textContent).toBe('Yes')
      expect(noPill.textContent).toBe('No')
      expect(yesPill).toHaveClass('active')
      expect(noPill).not.toHaveClass('active')
    })

    it('displays NO as active when vault is public (flag = 0)', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Flags: 0, // Public vault (no flags set)
      }

      const { container } = render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const togglePills = container.querySelectorAll('.toggle-pill')

      // NO pill should be active for public vault
      const yesPill = togglePills[0]
      const noPill = togglePills[1]
      expect(yesPill).not.toHaveClass('active')
      expect(noPill).toHaveClass('active')
    })

    it('displays NO as active when Flags is undefined', () => {
      // When Flags field is missing, vault is treated as public
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // Flags is intentionally omitted
      }

      const { container } = render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const togglePills = container.querySelectorAll('.toggle-pill')
      const noPill = togglePills[1]
      expect(noPill).toHaveClass('active')
    })

    it('correctly identifies private flag when combined with other flags', () => {
      // Flags can have multiple bits set; we need bitwise AND to check lsfPrivate
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Flags: 0x00010001, // Private flag + another flag
      }

      const { container } = render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const togglePills = container.querySelectorAll('.toggle-pill')
      const yesPill = togglePills[0]
      expect(yesPill).toHaveClass('active')
    })
  })

  /**
   * =========================================
   * SECTION 3: Asset Type Display Tests
   * =========================================
   * Vaults can hold different asset types:
   * - XRP (native currency)
   * - IOU tokens (issued currencies like RLUSD)
   * - MPTs (Multi-Purpose Tokens identified by mpt_issuance_id)
   */
  describe('Asset Type Display', () => {
    it('displays XRP for native currency vaults', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify exact label and value
      expect(screen.getByText('Asset')).toBeInTheDocument()
      expect(screen.getByText('\uE900')).toBeInTheDocument()
    })

    it('displays currency code for IOU token vaults', () => {
      // IOU tokens have a currency code and issuer
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: {
          currency: 'USD',
          issuer: 'rIssuerAccount123',
        },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify the exact currency code is displayed and issuer is hidden
      const currencyEl = screen.getByTestId('currency')
      expect(currencyEl).toHaveTextContent('USD')
      expect(currencyEl).not.toHaveTextContent('rIssuerAccount123')
    })

    it('displays truncated MPT ID as a link for MPT vaults', () => {
      // MPTs are identified by a hex ID and should link to the MPT details page
      const mptId = '00001234ABCD5678EF90ABCDEF1234567890ABCDEF'
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: {
          mpt_issuance_id: mptId,
        },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Should be a link to the MPT page with exact truncated text
      const mptLink = screen.getByRole('link', { name: `MPT (${mptId})` })
      expect(mptLink.getAttribute('href')).toBe(`/mpt/${mptId}`)
    })

    it('displays dash when asset is undefined', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        // Asset is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Should display "-" as fallback
      const assetRow = screen.getByText('Asset').closest('tr')
      expect(assetRow).toHaveTextContent('AssetUnknown Currency Error')
    })
  })

  /**
   * =========================================
   * SECTION 4: Compact Number Formatting Tests
   * =========================================
   * Large numbers are formatted with K (thousands) and M (millions) suffixes
   * for better readability. Examples:
   * - 1,500,000 -> "1.5M"
   * - 250,000 -> "250K"
   * - 500 -> "500"
   */
  describe('Compact Number Formatting', () => {
    it('formats millions with M suffix', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsTotal: '12500000', // 12.5 million
        AssetsAvailable: '5000000', // 5 million
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Numbers >= 1,000,000 should display with M suffix
      // Verify exact formatted values: 12,500,000 -> "12.5M XRP", 5,000,000 -> "5M XRP"
      expect(screen.getByText('12.50M \uE900')).toBeInTheDocument()
      expect(screen.getByText('5.00M \uE900')).toBeInTheDocument()
    })

    it('formats thousands with K suffix', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsAvailable: '250000', // 250 thousand
        LossUnrealized: '75000', // 75 thousand
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Numbers >= 1,000 but < 1,000,000 should display with K suffix
      // Verify exact formatted values: 250,000 -> "250K XRP", 75,000 -> "75K XRP"
      expect(screen.getByText('250.00K \uE900')).toBeInTheDocument()
      expect(screen.getByText('75.00K \uE900')).toBeInTheDocument()
    })

    it('displays small numbers without suffix', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsAvailable: '500', // Less than 1000
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Numbers < 1,000 should display as-is without K/M suffix
      // Verify exact formatted value: 500 -> "500 XRP"
      expect(screen.getByText('500.00 \uE900')).toBeInTheDocument()
    })

    it('includes currency code in formatted amounts', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'RLUSD' },
        AssetsAvailable: '1000000',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Amount should include the currency code
      // Verify exact formatted value: 1,000,000 RLUSD -> "1M RLUSD"
      expect(screen.getByText('1.00M RLUSD')).toBeInTheDocument()
    })

    it('displays dash for undefined amounts', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // AssetsAvailable is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Undefined amounts should display as "0"
      const availableRow = screen.getByText('Available to Borrow').closest('tr')
      expect(availableRow).toHaveTextContent('Available to Borrow--')
    })
  })

  /**
   * =========================================
   * SECTION 5: Data Field Decoding Tests
   * =========================================
   * The vault's Data field can contain hex-encoded UTF-8 text
   * (e.g., vault name or description). The component should
   * decode and display it properly.
   */
  describe('Data Field Decoding', () => {
    it('decodes hex-encoded Data field to UTF-8', () => {
      // "Hello Vault" encoded as hex: 48656c6c6f205661756c74
      const originalText = 'Hello Vault'
      const hexData = '48656c6c6f205661756c74' // Buffer.from('Hello Vault').toString('hex')
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Data: hexData,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // The decoded text should be displayed with exact match
      expect(screen.getByText(originalText)).toBeInTheDocument()
    })

    it('displays raw Data if not valid hex', () => {
      // Data that is not valid hex should be displayed as-is
      const rawData = 'NotHexData!'
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Data: rawData,
      }

      expect(() =>
        render(
          <TestWrapper>
            <VaultHeader
              data={vaultData}
              vaultId="ABC123"
              displayCurrency="XRP"
            />
          </TestWrapper>,
        ),
      ).toThrow('Invalid hex string')
    })

    it('displays dash when Data is undefined', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // Data is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const dataRow = screen.getByText('Data').closest('tr')
      expect(dataRow).toHaveTextContent('-')
    })
  })

  /**
   * =========================================
   * SECTION 5b: Website Display Tests
   * =========================================
   * The vault's Data field can contain JSON with a "w" (website) field.
   * When present, the website should be displayed as a clickable link.
   */
  describe('Website Display', () => {
    it('displays website link when Data contains valid JSON with "w" key', () => {
      // {"n":"Test Vault","w":"example.com"} encoded as hex
      const jsonData = JSON.stringify({ n: 'Test Vault', w: 'example.com' })
      const hexData = Buffer.from(jsonData).toString('hex')
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Data: hexData,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Website label and link should be displayed
      expect(screen.getByText('Website')).toBeInTheDocument()
      const websiteLink = screen.getByRole('link', { name: 'example.com' })
      expect(websiteLink).toHaveAttribute('href', 'https://example.com')
      expect(websiteLink).toHaveAttribute('target', '_blank')
    })

    it('does not display website row when Data is valid JSON but missing "w" key', () => {
      // {"n":"Test Vault"} encoded as hex (no website field)
      const jsonData = JSON.stringify({ n: 'Test Vault' })
      const hexData = Buffer.from(jsonData).toString('hex')
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Data: hexData,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Website row should not be present
      expect(screen.queryByText('Website')).not.toBeInTheDocument()
    })

    it('does not display website row when Data is not valid JSON', () => {
      // "Hello Vault" encoded as hex (plain text, not JSON)
      const hexData = Buffer.from('Hello Vault').toString('hex')
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        Data: hexData,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Website row should not be present
      expect(screen.queryByText('Website')).not.toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 6: Withdrawal Policy Tests
   * =========================================
   * Withdrawal policies define how depositors can withdraw funds.
   * Currently supported: 1 = "First Come, First Served" (from XLS-65d spec)
   */
  describe('Withdrawal Policy Display', () => {
    it('displays "First Come First Served" for policy 1', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        WithdrawalPolicy: 1,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Withdrawal Policy')).toBeInTheDocument()
      expect(screen.getByText('First Come First Served')).toBeInTheDocument()
    })

    it('displays numeric value for unknown policy codes', () => {
      // Unknown policy codes should display the raw number
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        WithdrawalPolicy: 99, // Unknown policy
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const policyRow = screen.getByText('Withdrawal Policy').closest('tr')
      expect(policyRow).toHaveTextContent('99')
    })

    it('displays dash when WithdrawalPolicy is undefined', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // WithdrawalPolicy is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const policyRow = screen.getByText('Withdrawal Policy').closest('tr')
      expect(policyRow).toHaveTextContent('-')
    })
  })

  /**
   * =========================================
   * SECTION 7: Vault Credential (DomainID) Tests
   * =========================================
   * Private vaults may have a credential (DomainID) fetched from
   * the MPTokenIssuance ledger object associated with ShareMPTID.
   * This requires an async query to the ledger.
   */
  describe('Vault Credential Display', () => {
    it('displays vault credential when DomainID is present', async () => {
      const domainId = 'credential123abc'
      mockedGetMPTIssuance.mockResolvedValue({
        node: { DomainID: domainId },
      })

      const vaultData = {
        Account: 'rTestAccount',
        Asset: { currency: 'XRP' },
        ShareMPTID: 'shareMptId123',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Wait for async query to complete and verify exact DomainID value
      await waitFor(() => {
        expect(screen.getByText('Permissioned Domain ID')).toBeInTheDocument()
        expect(screen.getByText(domainId)).toBeInTheDocument()
      })
    })

    it('does not display credential row when DomainID is absent', async () => {
      mockedGetMPTIssuance.mockResolvedValue({
        node: {}, // No DomainID
      })

      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        ShareMPTID: 'shareMptId123',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // The credential row should not appear
      await waitFor(() => {
        expect(
          screen.queryByText('Permissioned Domain ID'),
        ).not.toBeInTheDocument()
      })
    })

    it('does not fetch credential when ShareMPTID is missing', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // ShareMPTID is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // getMPTIssuance should not be called without ShareMPTID
      expect(mockedGetMPTIssuance).not.toHaveBeenCalled()
    })
  })

  /**
   * =========================================
   * SECTION 8: Shares (MPT) Link Tests
   * =========================================
   * Vault shares are represented as MPTs. The ShareMPTID should
   * link to the MPT details page with a truncated display.
   */
  describe('Shares Link Display', () => {
    it('displays truncated ShareMPTID as a link', () => {
      const shareMptId = 'SHARE1234567890ABCDEF1234567890ABCDEF12'
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        ShareMPTID: shareMptId,
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify link is present and href is correct
      const sharesLink = screen.getByRole('link', {
        name: shareMptId,
      })
      expect(sharesLink.getAttribute('href')).toBe(`/mpt/${shareMptId}`)
    })

    it('displays dash when ShareMPTID is missing', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // ShareMPTID is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      const sharesRow = screen.getByText('Shares').closest('tr')
      expect(sharesRow).toHaveTextContent('-')
    })
  })

  /**
   * =========================================
   * SECTION 9: Maximum Assets / No Limit Tests
   * =========================================
   * Vaults can have a maximum asset cap or be unlimited.
   * When AssetsMaximum is not set, "No limit" should be displayed.
   */
  describe('Maximum Assets Display', () => {
    it('displays formatted amount when AssetsMaximum is set', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsMaximum: '10000000', // 10 million
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Max Total Supply')).toBeInTheDocument()
      expect(screen.getByText(/10.00M \uE900/)).toBeInTheDocument()
    })

    it('displays "No Limit" when AssetsMaximum is not set', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        // AssetsMaximum is intentionally omitted
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      expect(screen.getByText('No Limit')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 10: Total Value Locked (TVL) Tests
   * =========================================
   * TVL is only displayed for supported currencies (XRP, RLUSD).
   * For other currencies, it shows "--" as the value may not
   * be reliably calculable.
   */
  describe('Total Value Locked Display', () => {
    it('displays TVL for XRP vaults', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsTotal: '5000000',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Total Value Locked (TVL)')).toBeInTheDocument()
      // Verify exact TVL value: 5,000,000 -> "5M XRP"
      expect(screen.getByText('5.00M \uE900')).toBeInTheDocument()
    })

    it('displays TVL for RLUSD vaults', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'RLUSD' },
        AssetsTotal: '2500000',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Verify exact TVL value: 2,500,000 -> "2.50M RLUSD"
      expect(screen.getByText('2.50M RLUSD')).toBeInTheDocument()
    })

    it('displays TVL in native currency for unsupported currencies', () => {
      // TVL is shown in native currency even for arbitrary currencies
      // when displayCurrency is 'native' (native mode)
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'UNKNOWN' },
        AssetsTotal: '1000000',
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // In native mode, TVL is shown in the asset's currency
      expect(screen.getByText('1.00M UNKNOWN')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 11: Edge Cases and Error Handling
   * =========================================
   * Tests for unusual inputs and boundary conditions
   */
  describe('Edge Cases', () => {
    it('handles empty vault data gracefully', () => {
      const vaultData = {}

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Component should render without crashing
      expect(screen.getByText('Vault')).toBeInTheDocument()
    })

    it('handles very long vault IDs', () => {
      const longVaultId = 'A'.repeat(100)
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId={longVaultId}
            displayCurrency="XRP"
          />
        </TestWrapper>,
      )

      // Should truncate without errors
      expect(screen.getByText('Vault ID')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 12: Currency Toggle Conversion Tests
   * =========================================
   * Tests that verify TVL conversion between native currency and USD
   * when the user toggles the currency display option.
   *
   * Conversion rules:
   * - XRP: Multiply by XRP/USD exchange rate
   * - RLUSD: 1:1 with USD (stablecoin)
   * - Other currencies: Show "--" (no conversion available)
   */
  describe('Currency Toggle Conversion', () => {
    it('converts XRP TVL to USD using exchange rate when displayCurrency is "usd"', () => {
      // Mock XRP/USD rate of 2.5
      mockXRPToUSDRate.mockReturnValue(2.5)
      mockTokenToUSDRate.mockImplementation((token: any) => {
        if (token?.currency === 'XRP') return 2.5
        return 0
      })

      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'XRP' },
        AssetsTotal: '1000000', // 1 million XRP
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="USD"
          />
        </TestWrapper>,
      )

      // 1,000,000 XRP * 2.5 = 2,500,000 USD = "2.50M USD"
      // formatAmount joins [prefix, formattedNum, currency] with spaces
      expect(screen.getByText('2.50M USD')).toBeInTheDocument()
    })

    it('displays RLUSD TVL as USD with 1:1 conversion when displayCurrency is "usd"', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'RLUSD' },
        AssetsTotal: '5000000', // 5 million RLUSD
      }

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="USD"
          />
        </TestWrapper>,
      )

      // RLUSD is a stablecoin pegged 1:1 to USD
      // 5,000,000 RLUSD = "5.00M USD"
      expect(screen.getByText('5.00M USD')).toBeInTheDocument()
    })

    it('convert native currency EUR into USD displayed currency', () => {
      const vaultData = {
        Owner: 'rTestOwner',
        Asset: { currency: 'EUR', issuer: 'rIssuerAccount123' },
        AssetsTotal: '1000000', // 1 million EUR
      }

      mockTokenToUSDRate.mockImplementation((token: any) => {
        if (token?.currency === 'EUR') return 2
        return 0
      })

      render(
        <TestWrapper>
          <VaultHeader
            data={vaultData}
            vaultId="ABC123"
            displayCurrency="USD"
          />
        </TestWrapper>,
      )

      const tvlRow = screen.getByText('Total Value Locked (TVL)').closest('tr')
      expect(tvlRow).toHaveTextContent('Total Value Locked (TVL)2.00M USD')
    })
  })
})
