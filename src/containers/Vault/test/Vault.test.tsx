/**
 * Vault Component Unit Tests
 *
 * This test suite validates the top-level Vault page component.
 * Tests focus on page-level behavior NOT covered by child component tests:
 *
 * - Page structure and Helmet title
 * - Loading state
 * - Error handling (NOT_FOUND, BAD_REQUEST, generic errors)
 * - No vault ID warning state
 * - Title section (decoded name vs "Yield Pool" fallback)
 * - Conditional rendering of child components
 * - Analytics tracking (trackScreenLoaded)
 * - Asset currency display logic
 *
 * Child components (VaultHeader, VaultLoans, VaultTransactions, VaultDepositors)
 * are mocked to avoid redundant testing - they have their own test suites.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import { Vault } from '../index'
import { getVault } from '../../../rippled/lib/rippled'
import Mock = jest.Mock

// Mock the rippled API
jest.mock('../../../rippled/lib/rippled', () => ({
  getVault: jest.fn(),
  getMPTIssuance: jest.fn(),
}))

// Mock analytics
const mockTrackScreenLoaded = jest.fn()
const mockTrackException = jest.fn()
jest.mock('../../shared/analytics', () => ({
  useAnalytics: () => ({
    trackScreenLoaded: mockTrackScreenLoaded,
    trackException: mockTrackException,
  }),
}))

// Mock NoMatch component to avoid its socket dependencies
jest.mock('../../NoMatch', () => ({
  __esModule: true,
  default: ({ title, hints }: { title: string; hints?: string[] }) => (
    <div data-testid="no-match">
      <div data-testid="no-match-title">{title}</div>
      {hints?.map((hint) => (
        <div data-testid="no-match-hint">{hint}</div>
      ))}
    </div>
  ),
}))

// Mock useTokenToUSDRate hook
jest.mock('../../shared/hooks/useTokenToUSDRate', () => ({
  useTokenToUSDRate: () => ({ rate: 2.0, isAvailable: true, isLoading: false }),
}))

// Mock child components to avoid testing their internals
jest.mock('../VaultHeader', () => ({
  VaultHeader: ({ vaultId }: { vaultId: string }) => (
    <div data-testid="vault-header">VaultHeader: {vaultId}</div>
  ),
}))

jest.mock('../VaultLoans', () => ({
  VaultLoans: ({ vaultId, vaultPseudoAccount, asset }: any) => {
    // Mock mirrors VaultLoans currency derivation logic
    const NON_STANDARD_CODE_LENGTH = 40
    const LP_TOKEN_IDENTIFIER = '03'
    const hexToString = (hex: string) => {
      let s = ''
      for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex.substring(i, i + 2), 16)
        if (!isNaN(code) && code !== 0) s += String.fromCharCode(code)
      }
      return s
    }
    let currency = ''
    if (asset?.currency) {
      if (
        asset.currency.length === NON_STANDARD_CODE_LENGTH &&
        asset.currency.substring(0, 2) !== LP_TOKEN_IDENTIFIER
      ) {
        currency = hexToString(asset.currency)
      } else {
        currency = asset.currency
      }
    } else if (asset?.mpt_issuance_id) {
      currency = 'MPT'
    }
    return (
      <div data-testid="vault-loans">
        VaultLoans: {vaultId} | {vaultPseudoAccount} | {currency}
      </div>
    )
  },
}))

jest.mock('../VaultTransactions', () => ({
  VaultTransactions: ({ accountId }: { accountId: string }) => (
    <div data-testid="vault-transactions">VaultTransactions: {accountId}</div>
  ),
}))

jest.mock('../VaultDepositors', () => ({
  VaultDepositors: ({ shareMptId }: { shareMptId: string }) => (
    <div data-testid="vault-depositors">VaultDepositors: {shareMptId}</div>
  ),
}))

const mockedGetVault = getVault as Mock
const mockSocket = {
  getState: jest.fn().mockReturnValue('connected'),
} as any

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
      },
    },
  })

/**
 * TestWrapper with route parameter support
 *
 * Uses MemoryRouter to simulate URL with vault ID parameter.
 * HelmetProvider is needed for the Helmet component.
 */
const createTestWrapper = (queryClient: QueryClient, vaultId: string = '') => {
  const initialEntries = vaultId ? [`/vault/${vaultId}`] : ['/vault/']

  return ({ children }: { children: React.ReactNode }) => (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={initialEntries}>
          <SocketContext.Provider value={mockSocket}>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/vault/:id?" element={children} />
              </Routes>
            </QueryClientProvider>
          </SocketContext.Provider>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>
  )
}

/**
 * Mock vault data generator
 *
 * Note: The Vault ledger object uses `Account` for the pseudo-account ID
 * (not `PseudoAccount`). This matches the XRPL Vault ledger entry structure.
 */
const createMockVaultData = (overrides: any = {}) => ({
  Owner: 'rOwnerAccount123',
  Account: 'rPseudoAccount456', // Vault's pseudo-account
  Asset: { currency: 'XRP' },
  AssetsTotal: '1000000',
  AssetsAvailable: '500000',
  ShareMPTID: 'SHARE_MPT_ID_123',
  ShareTotal: '100000',
  Data: '48656c6c6f205661756c74', // "Hello Vault" in hex
  ...overrides,
})

describe('Vault Component', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient = createTestQueryClient()
  })

  afterEach(() => {
    queryClient.clear()
  })

  /**
   * =========================================
   * SECTION 1: Page Structure Tests
   * =========================================
   */
  describe('Page Structure', () => {
    it('renders vault-page container', async () => {
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      const { container } = render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(container.querySelector('.vault-page')).toBeInTheDocument()
      })
    })

    it('applies section class for max-width constraints', async () => {
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      const { container } = render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const vaultPage = container.querySelector('.vault-page')
        expect(vaultPage).toBeInTheDocument()
        expect(vaultPage).toHaveClass('section')
      })
    })
  })

  /**
   * =========================================
   * SECTION 2: No Vault ID State Tests
   * =========================================
   */
  describe('No Vault ID State', () => {
    it('does not fetch vault data when no ID provided', () => {
      const TestWrapper = createTestWrapper(queryClient, '')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      expect(mockedGetVault).not.toHaveBeenCalled()
    })
  })

  /**
   * =========================================
   * SECTION 3: Loading State Tests
   * =========================================
   */
  describe('Loading State', () => {
    it('displays loader while fetching vault data', async () => {
      let resolvePromise: (value: any) => void
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockedGetVault.mockReturnValue(pendingPromise)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      const { container } = render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      expect(container.querySelector('.loader')).toBeInTheDocument()

      // Clean up
      resolvePromise!(createMockVaultData())
    })

    it('hides loader after data loads', async () => {
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      const { container } = render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(container.querySelector('.loader')).not.toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 4: Error Handling Tests
   * =========================================
   */
  describe('Error Handling', () => {
    it('displays NOT_FOUND error message', async () => {
      mockedGetVault.mockRejectedValue({ code: 404 })

      const TestWrapper = createTestWrapper(queryClient, 'INVALID_VAULT')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        // NoMatch component is rendered with vault_not_found title
        expect(screen.getByTestId('no-match')).toBeInTheDocument()
        expect(screen.getByTestId('no-match-title')).toHaveTextContent(
          'vault_not_found',
        )
      })
    })

    it('displays BAD_REQUEST error message', async () => {
      mockedGetVault.mockRejectedValue({ code: 400 })

      const TestWrapper = createTestWrapper(queryClient, 'MALFORMED_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('no-match')).toBeInTheDocument()
        expect(screen.getByTestId('no-match-title')).toHaveTextContent(
          'invalid_vault_id',
        )
      })
    })

    it('displays invalid vault ID message for non-hex vault IDs', async () => {
      // Simulates error from rippled when vault ID is not a valid hex string (e.g., "1234")
      mockedGetVault.mockRejectedValue({
        code: 400,
        message: 'Invalid vault ID format',
      })

      const TestWrapper = createTestWrapper(queryClient, '1234')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('no-match')).toBeInTheDocument()
        expect(screen.getByTestId('no-match-title')).toHaveTextContent(
          'invalid_vault_id',
        )
      })
    })

    it('tracks exception when fetch fails', async () => {
      const errorResponse = { code: 500, message: 'Server error' }
      mockedGetVault.mockRejectedValue(errorResponse)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockTrackException).toHaveBeenCalledWith(
          expect.stringContaining(
            'Error fetching Vault data for vault ID TEST_VAULT_ID',
          ),
        )
      })
    })

    it('displays user-friendly error message for generic errors', async () => {
      // Generic server error (not 404 or 400)
      mockedGetVault.mockRejectedValue({ code: 500, message: 'Internal error' })

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('no-match')).toBeInTheDocument()
        // Should show user-friendly message instead of generic "Something bad happened"
        expect(screen.getByTestId('no-match-title')).toHaveTextContent(
          'get_vault_failed',
        )
      })
    })
  })

  /**
   * =========================================
   * SECTION 5: Title Section Tests
   * =========================================
   */
  describe('Title Section', () => {
    it('displays decoded vault name from Data field', async () => {
      // {"n":"Hello Vault"} encoded as hex (JSON convention for vault name)
      const vaultData = createMockVaultData({
        Data: '7b226e223a2248656c6c6f205661756c74227d',
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Hello Vault')).toBeInTheDocument()
      })
    })

    it('displays "Yield Pool" fallback when no Data field', async () => {
      const vaultData = createMockVaultData({ Data: undefined })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Yield Pool')).toBeInTheDocument()
      })
    })

    it('displays vault ID with copy functionality', async () => {
      const testVaultId = 'VAULT_ID_12345'
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, testVaultId)
      const { container } = render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Vault ID:')).toBeInTheDocument()
        expect(screen.getByText(testVaultId)).toBeInTheDocument()

        // Verify CopyableText component is rendered with copy icon
        const copyableWrapper = container.querySelector(
          '.copyable-text-with-icon',
        )
        expect(copyableWrapper).toBeInTheDocument()

        // Verify copy button exists with accessible label
        const copyButton = screen.getByRole('button', {
          name: 'Click to copy',
        })
        expect(copyButton).toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 6: Child Component Rendering Tests
   * =========================================
   * Tests that child components receive correct props
   * and are conditionally rendered based on data.
   */
  describe('Child Component Rendering', () => {
    it('renders VaultHeader when vault data exists', async () => {
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('vault-header')).toBeInTheDocument()
      })
    })

    it('renders VaultLoans with Account when available', async () => {
      const vaultData = createMockVaultData({
        Account: 'rPseudoAccount123',
        Owner: 'rOwner456',
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toBeInTheDocument()
        // Should use Account (pseudo-account)
        expect(loansComponent).toHaveTextContent('rPseudoAccount123')
      })
    })

    it('does not render VaultLoans when no account ID available', async () => {
      const vaultData = createMockVaultData({
        Account: undefined,
        Owner: undefined,
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('vault-header')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('vault-loans')).not.toBeInTheDocument()
    })

    // TODO: Uncomment this when VaultDepositors made available
    // it('renders VaultDepositors when ShareMPTID exists', async () => {
    //   const vaultData = createMockVaultData({
    //     ShareMPTID: 'SHARE_MPT_123',
    //   })
    //   mockedGetVault.mockResolvedValue(vaultData)

    //   const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
    //   render(
    //     <TestWrapper>
    //       <Vault />
    //     </TestWrapper>,
    //   )

    //   await waitFor(() => {
    //     const depositorsComponent = screen.getByTestId('vault-depositors')
    //     expect(depositorsComponent).toBeInTheDocument()
    //     expect(depositorsComponent).toHaveTextContent('SHARE_MPT_123')
    //   })
    // })

    it('does not render VaultDepositors when ShareMPTID missing', async () => {
      const vaultData = createMockVaultData({
        ShareMPTID: undefined,
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByTestId('vault-header')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('vault-depositors')).not.toBeInTheDocument()
    })

    it('renders VaultTransactions when account ID exists', async () => {
      const vaultData = createMockVaultData({
        Account: 'rPseudoAccount123',
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const transactionsComponent = screen.getByTestId('vault-transactions')
        expect(transactionsComponent).toBeInTheDocument()
        expect(transactionsComponent).toHaveTextContent('rPseudoAccount123')
      })
    })

    it('renders all child components when vault data has required fields', async () => {
      // Default mock data includes: PseudoAccount, ShareMPTID, Asset - all required for full rendering
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      // Wait for vault data to load and all components to render
      await waitFor(() => {
        // VaultHeader always renders when vault data exists
        expect(screen.getByTestId('vault-header')).toBeInTheDocument()
      })

      // VaultLoans renders when PseudoAccount exists
      expect(screen.getByTestId('vault-loans')).toBeInTheDocument()

      // TODO: Uncomment this when VaultDepositors made available
      // // VaultDepositors renders when ShareMPTID exists
      // expect(screen.getByTestId('vault-depositors')).toBeInTheDocument()

      // VaultTransactions renders when PseudoAccount exists
      expect(screen.getByTestId('vault-transactions')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 7: Asset Currency Display Tests
   * =========================================
   */
  describe('Asset Currency Display', () => {
    it('passes XRP as currency for XRP vaults', async () => {
      // Standard 3-char currency codes are stored as-is (not hex-encoded)
      const vaultData = createMockVaultData({
        Asset: { currency: 'XRP' },
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toHaveTextContent('XRP')
      })
    })

    it('passes currency code for IOU vaults', async () => {
      // Standard 3-char currency codes are stored as-is (not hex-encoded)
      const vaultData = createMockVaultData({
        Asset: { currency: 'USD', issuer: 'rIssuer123' },
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toHaveTextContent('USD')
      })
    })

    it('passes MPT identifier for MPT vaults', async () => {
      // VaultLoans now derives currency internally and shows "MPT" for all MPT assets
      const vaultData = createMockVaultData({
        Asset: { mpt_issuance_id: 'MPT_ISSUANCE_ID_LONG_STRING_123456' },
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toHaveTextContent('MPT')
      })
    })

    it('decodes hex-encoded IOU currency code', async () => {
      // "RLUSD" encoded as hex (52=R, 4C=L, 55=U, 53=S, 44=D)
      const vaultData = createMockVaultData({
        Asset: {
          currency: '524C555344000000000000000000000000000000',
          issuer: 'rIssuer123',
        },
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toHaveTextContent('RLUSD')
      })
    })

    it('displays MPT identifier for MPT assets', async () => {
      // VaultLoans now derives currency internally and shows "MPT" for MPT assets
      // (MPT ticker lookup is only done for CurrencyToggle display, not for amount formatting)
      const mptIssuanceId = '00000C4F23D0CC3B3D973CDC631050101ABCD1234'
      const vaultData = createMockVaultData({
        Asset: { mpt_issuance_id: mptIssuanceId },
      })
      mockedGetVault.mockResolvedValue(vaultData)

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        const loansComponent = screen.getByTestId('vault-loans')
        expect(loansComponent).toHaveTextContent('MPT')
      })
    })
  })

  /**
   * =========================================
   * SECTION 8: Analytics Tracking Tests
   * =========================================
   */
  describe('Analytics Tracking', () => {
    it('tracks screen loaded on mount', async () => {
      mockedGetVault.mockResolvedValue(createMockVaultData())

      const TestWrapper = createTestWrapper(queryClient, 'TEST_VAULT_ID')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockTrackScreenLoaded).toHaveBeenCalledWith({
          vault_id: 'TEST_VAULT_ID',
        })
      })
    })

    it('tracks screen loaded with empty vault ID', () => {
      const TestWrapper = createTestWrapper(queryClient, '')
      render(
        <TestWrapper>
          <Vault />
        </TestWrapper>,
      )

      expect(mockTrackScreenLoaded).toHaveBeenCalledWith({
        vault_id: '',
      })
    })
  })
})
