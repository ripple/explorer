/**
 * VaultTransactions Component Unit Tests
 *
 * This test suite validates the VaultTransactions component which displays
 * a paginated list of transactions for a vault's pseudo account.
 *
 * Key concepts tested:
 * - Basic rendering (section title, table headers)
 * - Loading state with Loader component
 * - Empty state when no transactions exist
 * - Transaction list display with proper columns
 * - Error handling and error message display
 * - Pagination via "Load More" button
 * - Infinite query behavior for fetching transaction pages
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { VaultTransactions } from '../index'
import { getAccountTransactions } from '../../../../rippled'
import Mock = jest.Mock

// Mock the rippled library to control API responses
jest.mock('../../../../rippled', () => ({
  getAccountTransactions: jest.fn(),
}))

// Mock the analytics hook (used by LoadMoreButton and VaultTransactions)
const mockTrackException = jest.fn()
const mockTrack = jest.fn()
jest.mock('../../../shared/analytics', () => ({
  useAnalytics: () => ({
    trackException: mockTrackException,
    track: mockTrack,
  }),
}))

const mockedGetAccountTransactions = getAccountTransactions as Mock

// Mock socket client - represents the WebSocket connection to rippled
const mockSocket = {} as any

/**
 * Creates a fresh QueryClient for each test
 *
 * We disable retries and set stale time to 0 to make tests predictable.
 * Each test gets its own QueryClient to prevent state leakage between tests.
 */
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
 * TestWrapper Component
 *
 * Provides all necessary context providers for the VaultTransactions component:
 * - I18nextProvider: Internationalization for translated text
 * - Router: React Router for link components (transaction links)
 * - SocketContext: WebSocket connection for rippled queries
 * - QueryClientProvider: React Query for data fetching/caching
 */
const createTestWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) => (
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

/**
 * Mock transaction data generator
 *
 * Creates realistic transaction objects with all fields needed by TransactionTableRow.
 * Each transaction includes: hash, type, account, result, date.
 *
 * Note: We intentionally omit 'details' to avoid triggering nested TableDetail
 * components which may have complex dependencies (like Account component).
 */
const createMockTransaction = (overrides: any = {}) => ({
  hash: `HASH${Math.random().toString(36).substring(7).toUpperCase()}`,
  type: 'Payment',
  account: 'rTestAccount123',
  result: 'tesSUCCESS',
  date: '2024-01-15T10:30:00Z',
  ...overrides,
})

describe('VaultTransactions Component', () => {
  let queryClient: QueryClient

  // Create fresh QueryClient and reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient = createTestQueryClient()
  })

  // Clean up after each test
  afterEach(() => {
    queryClient.clear()
  })

  /**
   * =========================================
   * SECTION 1: Basic Rendering Tests
   * =========================================
   * These tests verify the component renders correctly with its
   * structural elements: title, divider, and table headers.
   */
  describe('Basic Rendering', () => {
    it('renders the transactions section title', async () => {
      // Setup: Return empty transactions to focus on structure
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // The component should display "Transactions" as the section title
      await waitFor(() => {
        const title = screen.getByText('Transactions')
        expect(title.tagName).toBe('H2')
        expect(title).toHaveClass('vault-transactions-title')
      })
    })

    it('renders the divider element', async () => {
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Verify the divider element exists for visual separation
      await waitFor(() => {
        expect(
          container.querySelector('.vault-transactions-divider'),
        ).toBeInTheDocument()
      })
    })

    it('renders table headers with hash column', async () => {
      // VaultTransactions passes hasHashColumn as true
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Verify all expected column headers are present
      // The TransactionTable renders these headers when hasHashColumn/hasAmountColumn are true
      await waitFor(() => {
        expect(screen.getByText('Tx Hash')).toBeInTheDocument()
        expect(screen.getByText('Account')).toBeInTheDocument()
        expect(screen.getByText('Transaction Type')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Date/time (UTC)')).toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 2: Loading State Tests
   * =========================================
   * When fetching transactions, a Loader should be displayed.
   * This provides visual feedback to users during data retrieval.
   */
  describe('Loading State', () => {
    it('displays loader while fetching transactions', async () => {
      // Setup: Create a promise that won't resolve immediately to keep loading state
      let resolvePromise: (value: any) => void
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockedGetAccountTransactions.mockReturnValue(pendingPromise)

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // The Loader component should be visible during fetch
      expect(container.querySelector('.loader')).toBeInTheDocument()

      // Clean up: resolve the promise
      resolvePromise!({ transactions: [], marker: undefined })
    })

    it('hides loader after transactions are loaded', async () => {
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [createMockTransaction()],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Wait for loading to complete
      await waitFor(() => {
        expect(container.querySelector('.loader')).not.toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 3: Empty State Tests
   * =========================================
   * When no transactions exist for an account, the component should
   * display an appropriate empty state message.
   */
  describe('Empty State', () => {
    it('displays empty message when no transactions exist', async () => {
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // The TransactionTable shows a default empty message
      await waitFor(() => {
        expect(screen.getByText('No transactions found.')).toBeInTheDocument()
      })
    })

    it('does not show Load More button when there are no transactions', async () => {
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.queryByText('Load more...')).not.toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 4: Transaction Display Tests
   * =========================================
   * These tests verify that transactions are rendered correctly
   * with all their details: hash, account, type, amount, status, date.
   */
  describe('Transaction Display', () => {
    it('renders transaction rows for each transaction', async () => {
      const transactions = [
        createMockTransaction({ hash: 'HASH001ABC' }),
        createMockTransaction({ hash: 'HASH002DEF' }),
        createMockTransaction({ hash: 'HASH003GHI' }),
      ]

      mockedGetAccountTransactions.mockResolvedValue({
        transactions,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Each transaction should render as a list item
      await waitFor(() => {
        // transaction-li class is used for each row (excluding header)
        const transactionRows = container.querySelectorAll(
          '.transaction-li:not(.transaction-li-header)',
        )
        expect(transactionRows.length).toBe(3)
      })
    })

    it('displays transaction hash in shortened format', async () => {
      // Transaction hashes are typically 64 characters; UI shortens them for readability
      const fullHash =
        'ABC123DEF456789012345678901234567890123456789012345678901234'
      const transactions = [createMockTransaction({ hash: fullHash })]

      mockedGetAccountTransactions.mockResolvedValue({
        transactions,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // The hash should be shortened (first 6 chars + ... + last 6 chars pattern)
      await waitFor(() => {
        // shortenTxHash function shortens to "ABC123...1234" format
        const hashElement = screen.getByText(/ABC123...901234/)
        expect(hashElement).toBeInTheDocument()
      })
    })

    it('shows success status for successful transactions', async () => {
      const transactions = [createMockTransaction({ result: 'tesSUCCESS' })]

      mockedGetAccountTransactions.mockResolvedValue({
        transactions,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Successful transactions have 'success' class
      await waitFor(() => {
        const successRow = container.querySelector('.transaction-li.success')
        expect(successRow).toBeInTheDocument()
      })
    })

    it('shows fail status for failed transactions', async () => {
      // Non-tesSUCCESS results are considered failures
      const transactions = [createMockTransaction({ result: 'tecNO_DST' })]

      mockedGetAccountTransactions.mockResolvedValue({
        transactions,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Failed transactions have 'fail' class
      await waitFor(() => {
        const failRow = container.querySelector('.transaction-li.fail')
        expect(failRow).toBeInTheDocument()
      })
    })

    it('displays different transaction types correctly', async () => {
      // Vault transactions can include various types: deposits, withdrawals, loans, etc.
      const transactions = [
        createMockTransaction({ type: 'VaultDeposit', hash: 'HASH_DEPOSIT' }),
        createMockTransaction({ type: 'VaultWithdraw', hash: 'HASH_WITHDRAW' }),
        createMockTransaction({ type: 'VaultClawback', hash: 'HASH_CLAWBACK' }),
      ]

      mockedGetAccountTransactions.mockResolvedValue({
        transactions,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Vault Deposit')).toBeInTheDocument()
        expect(screen.getByText('Vault Withdraw')).toBeInTheDocument()
        expect(screen.getByText('Vault Clawback')).toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 5: Error Handling Tests
   * =========================================
   * When API calls fail, the component should display appropriate
   * error messages to inform the user of the issue.
   */
  describe('Error Handling', () => {
    it('displays error message when transaction fetch fails', async () => {
      // Simulate API error
      mockedGetAccountTransactions.mockRejectedValue(
        new Error('get_vault_transactions_failed'),
      )

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // The error message is displayed via TransactionTable's emptyMessage
      await waitFor(() => {
        expect(
          screen.getByText('Unable to load vault transactions at this time.'),
        ).toBeInTheDocument()
      })
    })

    it('does not display loader when error occurs', async () => {
      mockedGetAccountTransactions.mockRejectedValue(
        new Error('get_vault_transactions_failed'),
      )

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(container.querySelector('.loader')).not.toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 6: Pagination Tests
   * =========================================
   * The component uses infinite query for pagination. When more
   * transactions are available, a "Load More" button appears.
   */
  describe('Pagination', () => {
    it('displays Load More button when more results are available', async () => {
      // When API returns a marker, it indicates more results exist
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [createMockTransaction()],
        marker: 'next_page_marker', // Presence of marker means more pages
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Load more...')).toBeInTheDocument()
      })
    })

    it('does not display Load More button when no more results', async () => {
      // No marker means this is the last page
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [createMockTransaction()],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.queryByText('Load more...')).not.toBeInTheDocument()
      })
    })

    it('fetches next page when Load More is clicked', async () => {
      // First page response with marker indicating more pages
      const firstPageTransactions = [
        createMockTransaction({ hash: 'FIRST_PAGE_HASH' }),
      ]
      const secondPageTransactions = [
        createMockTransaction({ hash: 'SECOND_PAGE_HASH' }),
      ]

      mockedGetAccountTransactions
        .mockResolvedValueOnce({
          transactions: firstPageTransactions,
          marker: 'page_2_marker',
        })
        .mockResolvedValueOnce({
          transactions: secondPageTransactions,
          marker: undefined, // No more pages
        })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Wait for first page to load
      await waitFor(() => {
        expect(screen.getByText('Load more...')).toBeInTheDocument()
      })

      // Click Load More
      fireEvent.click(screen.getByText('Load more...'))

      // Verify second page was requested
      await waitFor(() => {
        expect(mockedGetAccountTransactions).toHaveBeenCalledTimes(2)
      })
    })

    it('accumulates transactions from multiple pages', async () => {
      const firstPageTransactions = [
        createMockTransaction({ hash: 'PAGE1_HASH1', account: 'rAccount1' }),
        createMockTransaction({ hash: 'PAGE1_HASH2', account: 'rAccount2' }),
      ]
      const secondPageTransactions = [
        createMockTransaction({ hash: 'PAGE2_HASH1', account: 'rAccount3' }),
      ]

      mockedGetAccountTransactions
        .mockResolvedValueOnce({
          transactions: firstPageTransactions,
          marker: 'page_2_marker',
        })
        .mockResolvedValueOnce({
          transactions: secondPageTransactions,
          marker: undefined,
        })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Wait for first page
      await waitFor(() => {
        expect(screen.getByText('Load more...')).toBeInTheDocument()
      })

      // Click Load More to fetch second page
      fireEvent.click(screen.getByText('Load more...'))

      // After loading both pages, all 3 transactions should be displayed
      await waitFor(() => {
        const transactionRows = container.querySelectorAll(
          '.transaction-li:not(.transaction-li-header)',
        )
        expect(transactionRows.length).toBe(3)
      })
    })

    it('hides Load More button after all pages are loaded', async () => {
      mockedGetAccountTransactions
        .mockResolvedValueOnce({
          transactions: [createMockTransaction()],
          marker: 'page_2_marker',
        })
        .mockResolvedValueOnce({
          transactions: [createMockTransaction()],
          marker: undefined, // Last page
        })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Load more...')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Load more...'))

      // After loading last page, Load More should disappear
      await waitFor(() => {
        expect(screen.queryByText('Load more...')).not.toBeInTheDocument()
      })
    })
  })

  /**
   * =========================================
   * SECTION 7: Query Behavior Tests
   * =========================================
   * Tests for the useInfiniteQuery behavior and its configuration.
   */
  describe('Query Behavior', () => {
    it('does not fetch when accountId is empty', () => {
      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="" />
        </TestWrapper>,
      )

      // Query should not be enabled when accountId is empty
      expect(mockedGetAccountTransactions).not.toHaveBeenCalled()
    })

    it('fetches transactions with correct accountId', async () => {
      const testAccountId = 'rVaultPseudoAccount456'
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId={testAccountId} />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockedGetAccountTransactions).toHaveBeenCalledWith(
          testAccountId,
          undefined, // currency
          '', // marker (empty for first page)
          undefined, // limit
          mockSocket, // rippledSocket
        )
      })
    })

    it('passes marker to subsequent page requests', async () => {
      const pageMarker = 'test_marker_12345'
      mockedGetAccountTransactions
        .mockResolvedValueOnce({
          transactions: [createMockTransaction()],
          marker: pageMarker,
        })
        .mockResolvedValueOnce({
          transactions: [],
          marker: undefined,
        })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText('Load more...')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Load more...'))

      // Second call should include the marker from first response
      await waitFor(() => {
        expect(mockedGetAccountTransactions).toHaveBeenNthCalledWith(
          2,
          'rTestAccount',
          undefined,
          pageMarker, // marker from previous response
          undefined,
          mockSocket,
        )
      })
    })
  })

  /**
   * =========================================
   * SECTION 8: Edge Cases
   * =========================================
   * Tests for unusual inputs and boundary conditions.
   */
  describe('Edge Cases', () => {
    it('handles transactions with missing details gracefully', async () => {
      // Some transactions might not have details or amount
      const transactionWithoutDetails = {
        hash: 'HASH_NO_DETAILS',
        type: 'AccountSet',
        account: 'rTestAccount',
        result: 'tesSUCCESS',
        date: '2024-01-15T10:30:00Z',
        // No details field
      }

      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [transactionWithoutDetails],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      const { container } = render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Component should render without crashing
      await waitFor(() => {
        const transactionRows = container.querySelectorAll(
          '.transaction-li:not(.transaction-li-header)',
        )
        expect(transactionRows.length).toBe(1)
      })
    })

    it('handles API returning null transactions array', async () => {
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: null,
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId="rTestAccount" />
        </TestWrapper>,
      )

      // Should show empty message, not crash
      await waitFor(() => {
        expect(screen.getByText('No transactions found.')).toBeInTheDocument()
      })
    })

    it('handles very long account IDs', async () => {
      const longAccountId = `r${'A'.repeat(50)}`
      mockedGetAccountTransactions.mockResolvedValue({
        transactions: [],
        marker: undefined,
      })

      const TestWrapper = createTestWrapper(queryClient)
      render(
        <TestWrapper>
          <VaultTransactions accountId={longAccountId} />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockedGetAccountTransactions).toHaveBeenCalledWith(
          longAccountId,
          undefined,
          '',
          undefined,
          mockSocket,
        )
      })
    })
  })
})
