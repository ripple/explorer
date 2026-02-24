/**
 * BrokerLoansTable Component Unit Tests
 *
 * This test suite validates the BrokerLoansTable component which displays
 * a filterable, paginated table of loans for a loan broker.
 *
 * Key concepts tested:
 * - Empty state when no loans exist
 * - Filter functionality (All Loans, Default, Impaired)
 * - Table header rendering
 * - Pagination controls and navigation
 * - Filter + pagination interaction (page reset on filter change)
 * - Loan row rendering
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { BrokerLoansTable } from '../BrokerLoansTable'
import { LoanData } from '../LoanRow'
import { getLedgerEntry } from '../../../../rippled/lib/rippled'
import { LSF_LOAN_DEFAULT, LSF_LOAN_IMPAIRED } from '../utils'
import { isCurrencyExoticSymbol } from '../../../shared/utils'
import Mock = jest.Mock

jest.mock('../../../../rippled/lib/rippled', () => ({
  getLedgerEntry: jest.fn(),
}))

const mockedGetLedgerEntry = getLedgerEntry as Mock
const mockSocket = {} as any

// Default test props
const defaultDisplayCurrency = 'XRP'
const defaultAsset = { currency: 'XRP' }

/**
 * Creates a fresh QueryClient for each test
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
 * BrokerLoansTable needs:
 * - I18nextProvider: For translated text (filter buttons, headers, empty message)
 * - Router: For Account links in LoanRow
 * - QueryClientProvider: For useTokenToUSDRate hook in LoanRow
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Router>{children}</Router>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

/**
 * SocketTestWrapper Component
 *
 * Like TestWrapper but includes SocketContext.Provider so that the
 * originalPrincipal useQuery (enabled: !!rippledSocket) actually fires.
 */
const SocketTestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SocketContext.Provider value={mockSocket}>
          <Router>{children}</Router>
        </SocketContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

/**
 * Mock loan data generator
 *
 * Creates a loan object with all required fields.
 * The Flags field can be set to simulate Default or Impaired status.
 */
const createMockLoan = (overrides: Partial<LoanData> = {}): LoanData => ({
  index: `LOAN_${Math.random().toString(36).substring(7).toUpperCase()}`,
  Borrower: `rBorrower${Math.random().toString(36).substring(7)}`,
  LoanBrokerID: 'BROKER_123',
  PrincipalOutstanding: '10000',
  TotalValueOutstanding: '10500',
  InterestRate: 500,
  LateInterestRate: 1000,
  CloseInterestRate: 0,
  LoanOriginationFee: '100',
  LoanServiceFee: '50',
  LatePaymentFee: '25',
  ClosePaymentFee: '200',
  OverpaymentFee: 100,
  PaymentInterval: 2592000,
  PaymentRemaining: 12,
  GracePeriod: 432000,
  StartDate: 750000000,
  NextPaymentDueDate: 752592000,
  Flags: 0,
  ...overrides,
})

/**
 * Helper to generate multiple loans
 */
const createMockLoans = (
  count: number,
  overrides: Partial<LoanData> = {},
): LoanData[] =>
  Array.from({ length: count }, (_, i) =>
    createMockLoan({ index: `LOAN_${i + 1}`, ...overrides }),
  )

describe('BrokerLoansTable Component', () => {
  /**
   * =========================================
   * SECTION 1: Empty State Tests
   * =========================================
   * When no loans exist, display an appropriate message.
   */
  describe('Empty State', () => {
    it('displays empty message when loans array is empty', () => {
      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={[]}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(
        screen.getByText('No loans found for this broker.'),
      ).toBeInTheDocument()
    })

    it('displays empty message when loans is undefined', () => {
      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={undefined}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(
        screen.getByText('No loans found for this broker.'),
      ).toBeInTheDocument()
    })

    it('does not render filter bar when no loans exist', () => {
      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={[]}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(
        container.querySelector('.loans-filter-bar'),
      ).not.toBeInTheDocument()
    })

    it('does not render pagination when no loans exist', () => {
      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={[]}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(
        container.querySelector('.loans-pagination'),
      ).not.toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 2: Table Header Tests
   * =========================================
   * Verify all column headers are rendered correctly.
   */
  describe('Table Headers', () => {
    it('renders all column headers', () => {
      const loans = [createMockLoan()]

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Loan ID')).toBeInTheDocument()
      expect(screen.getByText('Borrower')).toBeInTheDocument()
      expect(screen.getByText('Amount Requested')).toBeInTheDocument()
      expect(screen.getByText('Interest Rate')).toBeInTheDocument()
      expect(screen.getByText('Outstanding Balance')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 3: Filter Bar Tests
   * =========================================
   * Test the filter buttons and their functionality.
   */
  describe('Filter Bar', () => {
    it('renders all filter buttons', () => {
      const loans = [createMockLoan()]

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('All Loans')).toBeInTheDocument()
      expect(screen.getByText('Default')).toBeInTheDocument()
      expect(screen.getByText('Impaired')).toBeInTheDocument()
    })

    it('All Loans filter is active by default', () => {
      const loans = [createMockLoan()]

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      const allLoansBtn = screen.getByText('All Loans')
      expect(allLoansBtn).toHaveClass('active')

      // Other filters should not be active
      const defaultBtn = screen.getByText('Default')
      const impairedBtn = screen.getByText('Impaired')
      expect(defaultBtn).not.toHaveClass('active')
      expect(impairedBtn).not.toHaveClass('active')
    })

    it('clicking filter button changes active state', () => {
      const loans = [createMockLoan()]

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      const defaultBtn = screen.getByText('Default')
      fireEvent.click(defaultBtn)

      // Default should now be active
      expect(defaultBtn).toHaveClass('active')
      // All Loans should no longer be active
      expect(screen.getByText('All Loans')).not.toHaveClass('active')
    })

    it('renders filter icon', () => {
      const loans = [createMockLoan()]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(container.querySelector('.filter-icon')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 4: Filter Functionality Tests
   * =========================================
   * Verify that filters correctly show/hide loans based on status.
   */
  describe('Filter Functionality', () => {
    it('All Loans filter shows all loans', () => {
      const loans = [
        createMockLoan({ index: 'LOAN_CURRENT', Flags: 0 }),
        createMockLoan({ index: 'LOAN_DEFAULT', Flags: LSF_LOAN_DEFAULT }),
        createMockLoan({ index: 'LOAN_IMPAIRED', Flags: LSF_LOAN_IMPAIRED }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // All 3 loans should be displayed
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(3)
    })

    it('Default filter shows only defaulted loans', () => {
      const loans = [
        createMockLoan({ index: 'LOAN_CURRENT', Flags: 0 }),
        createMockLoan({ index: 'LOAN_DEFAULT_1', Flags: LSF_LOAN_DEFAULT }),
        createMockLoan({ index: 'LOAN_DEFAULT_2', Flags: LSF_LOAN_DEFAULT }),
        createMockLoan({ index: 'LOAN_IMPAIRED', Flags: LSF_LOAN_IMPAIRED }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click Default filter button (in the filter-buttons container)
      const filterButtons = container.querySelector('.filter-buttons')
      const defaultBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(2)',
      )
      fireEvent.click(defaultBtn!)

      // Only 2 defaulted loans should be displayed
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(2)
    })

    it('Impaired filter shows only impaired loans', () => {
      const loans = [
        createMockLoan({ index: 'LOAN_CURRENT', Flags: 0 }),
        createMockLoan({ index: 'LOAN_DEFAULT', Flags: LSF_LOAN_DEFAULT }),
        createMockLoan({ index: 'LOAN_IMPAIRED_1', Flags: LSF_LOAN_IMPAIRED }),
        createMockLoan({ index: 'LOAN_IMPAIRED_2', Flags: LSF_LOAN_IMPAIRED }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click Impaired filter button (3rd button in filter-buttons)
      const filterButtons = container.querySelector('.filter-buttons')
      const impairedBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(3)',
      )
      fireEvent.click(impairedBtn!)

      // Only 2 impaired loans should be displayed
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(2)
    })

    it('shows empty state when filter has no matching loans', () => {
      // All loans are current (no flags)
      const loans = [
        createMockLoan({ index: 'LOAN_1', Flags: 0 }),
        createMockLoan({ index: 'LOAN_2', Flags: 0 }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click Default filter button - no loans match
      const filterButtons = container.querySelector('.filter-buttons')
      const defaultBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(2)',
      )
      fireEvent.click(defaultBtn!)

      // No loan rows should be displayed
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(0)
    })

    it('switching back to All Loans shows all loans again', () => {
      const loans = [
        createMockLoan({ index: 'LOAN_1', Flags: 0 }),
        createMockLoan({ index: 'LOAN_2', Flags: LSF_LOAN_DEFAULT }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      const filterButtons = container.querySelector('.filter-buttons')
      const defaultBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(2)',
      )
      const allLoansBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(1)',
      )

      // Apply Default filter
      fireEvent.click(defaultBtn!)
      expect(container.querySelectorAll('.loan-row').length).toBe(1)

      // Switch back to All Loans
      fireEvent.click(allLoansBtn!)
      expect(container.querySelectorAll('.loan-row').length).toBe(2)
    })
  })

  /**
   * =========================================
   * SECTION 5: Pagination Display Tests
   * =========================================
   * Test pagination controls visibility and state.
   */
  describe('Pagination Display', () => {
    it('does not show pagination when loans fit on one page', () => {
      // ITEMS_PER_PAGE is 10, so 5 loans should not need pagination
      const loans = createMockLoans(5)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(
        container.querySelector('.loans-pagination'),
      ).not.toBeInTheDocument()
    })

    it('shows pagination when loans exceed one page', () => {
      // More than 10 loans requires pagination
      const loans = createMockLoans(15)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      expect(container.querySelector('.loans-pagination')).toBeInTheDocument()
    })

    it('displays correct page numbers for small number of pages', () => {
      // 25 loans = 3 pages (at 10 per page)
      const loans = createMockLoans(25)

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Should show pages 1, 2, 3
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    })

    it('first page is active by default', () => {
      const loans = createMockLoans(25)

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      const page1Btn = screen.getByRole('button', { name: '1' })
      expect(page1Btn).toHaveClass('active')
    })

    it('Previous button is disabled on first page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // The Pagination component has prev buttons as the first two .page-btn elements
      const pageButtons = container.querySelectorAll('.page-btn')
      const prevBtn = pageButtons[1] // Second button is single prev (first is double prev)
      expect(prevBtn).toBeDisabled()
    })

    it('Next button is enabled on first page when more pages exist', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // The Pagination component has next buttons as the last two .page-btn elements
      const pageButtons = container.querySelectorAll('.page-btn')
      const nextBtn = pageButtons[2] // Third button is single next
      expect(nextBtn).not.toBeDisabled()
    })
  })

  /**
   * =========================================
   * SECTION 6: Pagination Navigation Tests
   * =========================================
   * Test clicking pagination controls to navigate between pages.
   */
  describe('Pagination Navigation', () => {
    it('clicking Next navigates to next page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click Next (third .page-btn)
      const pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[2])

      // Page 2 should now be active
      const page2Btn = screen.getByRole('button', { name: '2' })
      expect(page2Btn).toHaveClass('active')
    })

    it('clicking Previous navigates to previous page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Go to page 2 first (click Next - third .page-btn)
      let pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[2])

      // Click Previous (second .page-btn)
      pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[1])

      // Page 1 should be active again
      const page1Btn = screen.getByRole('button', { name: '1' })
      expect(page1Btn).toHaveClass('active')
    })

    it('clicking Last navigates to last page', () => {
      // 25 loans = 3 pages
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click Last (fourth .page-btn - double arrow next)
      const pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[3])

      // Page 3 should be active
      const page3Btn = screen.getByRole('button', { name: '3' })
      expect(page3Btn).toHaveClass('active')
    })

    it('clicking page number navigates directly to that page', () => {
      const loans = createMockLoans(25)

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Click page 3 directly
      fireEvent.click(screen.getByRole('button', { name: '3' }))

      const page3Btn = screen.getByRole('button', { name: '3' })
      expect(page3Btn).toHaveClass('active')
    })

    it('Next button is disabled on last page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Go to last page (click Last - fourth .page-btn)
      let pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[3])

      // Next should be disabled (third .page-btn)
      pageButtons = container.querySelectorAll('.page-btn')
      expect(pageButtons[2]).toBeDisabled()
    })

    it('Last button is disabled on last page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Go to last page (click Last - fourth .page-btn)
      let pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[3])

      // Last should be disabled (fourth .page-btn)
      pageButtons = container.querySelectorAll('.page-btn')
      expect(pageButtons[3]).toBeDisabled()
    })
  })

  /**
   * =========================================
   * SECTION 7: Pagination with Ellipsis Tests
   * =========================================
   * When there are many pages, ellipsis (...) should appear.
   */
  describe('Pagination with Ellipsis', () => {
    it('shows ellipsis for many pages', () => {
      // 100 loans = 10 pages, should show ellipsis
      const loans = createMockLoans(100)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Should have ellipsis element (Pagination component uses .page-ellipsis)
      const ellipsis = container.querySelectorAll('.page-ellipsis')
      expect(ellipsis.length).toBeGreaterThan(0)
    })

    it('always shows first and last page numbers', () => {
      // 100 loans = 10 pages
      const loans = createMockLoans(100)

      render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // First page (1) should always be visible
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
      // Last page (10) should always be visible
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 8: Filter + Pagination Interaction
   * =========================================
   * Changing filter should reset pagination to page 1.
   */
  describe('Filter and Pagination Interaction', () => {
    it('resets to page 1 when filter changes', () => {
      // Create 15 current loans and 15 defaulted loans
      // This ensures pagination exists for both All Loans (30 = 3 pages) and Default (15 = 2 pages)
      const currentLoans = createMockLoans(15, { Flags: 0 })
      const defaultedLoans = createMockLoans(15, { Flags: LSF_LOAN_DEFAULT })
      const loans = [...currentLoans, ...defaultedLoans]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Navigate to page 2 (click Next - third .page-btn)
      const pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[2])
      expect(screen.getByRole('button', { name: '2' })).toHaveClass('active')

      // Change filter to Default using specific selector
      const filterButtons = container.querySelector('.filter-buttons')
      const defaultBtn = filterButtons?.querySelector(
        '.filter-btn:nth-child(2)',
      )
      fireEvent.click(defaultBtn!)

      // Should be back on page 1 (filter reset pagination)
      expect(screen.getByRole('button', { name: '1' })).toHaveClass('active')
    })

    it('pagination updates based on filtered loan count', () => {
      // 25 loans total, but only 5 are defaulted
      const currentLoans = createMockLoans(20, { Flags: 0 })
      const defaultedLoans = createMockLoans(5, { Flags: LSF_LOAN_DEFAULT })
      const loans = [...currentLoans, ...defaultedLoans]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // With all loans, should have 3 pages (25 loans / 10 per page)
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()

      // Filter to Default only (5 loans = 1 page)
      fireEvent.click(screen.getByText('Default'))

      // Pagination should disappear (only 5 loans fit on one page)
      expect(
        container.querySelector('.loans-pagination'),
      ).not.toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 9: Items Per Page Tests
   * =========================================
   * Verify correct number of items displayed per page.
   */
  describe('Items Per Page', () => {
    it('displays maximum 10 loans per page', () => {
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // First page should show 10 loans
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(10)
    })

    it('displays remaining loans on last page', () => {
      // 25 loans: page 1 = 10, page 2 = 10, page 3 = 5
      const loans = createMockLoans(25)

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="XRP"
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
          />
        </TestWrapper>,
      )

      // Go to last page (click Last - fourth .page-btn)
      const pageButtons = container.querySelectorAll('.page-btn')
      fireEvent.click(pageButtons[3])

      // Should show 5 loans on page 3
      const rows = container.querySelectorAll('.loan-row')
      expect(rows.length).toBe(5)
    })
  })

  /**
   * =========================================
   * SECTION 10: Currency Prop Tests
   * =========================================
   * Verify currency is passed through to LoanRow.
   */
  describe('Currency Prop tests', () => {
    it('renders correctly with non-XRP/non-USD currency', () => {
      // Test with EUR - an arbitrary IOU currency that is neither XRP nor RLUSD
      // This ensures the component handles any currency type correctly
      const loans = [
        createMockLoan({
          index: 'LOAN_EUR_1',
          PrincipalOutstanding: '5000',
          TotalValueOutstanding: '5250',
        }),
      ]

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </TestWrapper>,
      )

      // Table should render with loan row
      expect(container.querySelector('.loan-row')).toBeInTheDocument()

      // Verify the amount-requested and outstanding-balance cells display EUR values
      const loanRow = container.querySelector('.loan-row')!
      const amountRequested = loanRow.querySelector('.amount-requested')
      const outstandingBalance = loanRow.querySelector('.outstanding-balance')
      expect(amountRequested).toHaveTextContent('5,000.00 EUR')
      expect(outstandingBalance).toHaveTextContent('5,250.00 EUR')
    })

    it(`Render the BrokerLoans table with BTC exotic currency`, () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_BTC_1',
          PrincipalOutstanding: '5000',
          TotalValueOutstanding: '5250',
        }),
      ]

      const btcAsset = { currency: 'BTC', issuer: 'rTestIssuer' }

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency={btcAsset.currency}
            displayCurrency={btcAsset.currency}
            asset={btcAsset}
            isCurrencySpecialSymbol={isCurrencyExoticSymbol(btcAsset.currency)}
          />
        </TestWrapper>,
      )

      // Table should render with loan row
      expect(container.querySelector('.loan-row')).toBeInTheDocument()

      // Currency should appear in the amount columns
      const elementsWithCurrency = screen.getAllByText(/\u20BF 5,250.00/)
      expect(elementsWithCurrency.length).toBeGreaterThan(0)

      // Verify XRP and USD do not appear - ensures EUR is used throughout
      expect(screen.queryByText(/XRP/)).not.toBeInTheDocument()
      expect(screen.queryByText(/USD/)).not.toBeInTheDocument()
    })

    it(`display a BTC-denominated Loan in USD currency`, () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_BTC_1',
          PrincipalOutstanding: '5000',
          TotalValueOutstanding: '5250',
        }),
      ]

      const btcAsset = { currency: 'BTC', issuer: 'rTestIssuer' }

      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency={btcAsset.currency}
            displayCurrency="USD"
            asset={btcAsset}
            isCurrencySpecialSymbol={isCurrencyExoticSymbol(btcAsset.currency)}
          />
        </TestWrapper>,
      )

      // Table should render with loan row
      expect(container.querySelector('.loan-row')).toBeInTheDocument()
      const loanRow = container.querySelector('.loan-row')!
      const amountRequested = loanRow.querySelector('.amount-requested')
      const outstandingBalance = loanRow.querySelector('.outstanding-balance')
      expect(amountRequested).toHaveTextContent('$7,500.00 USD')
      expect(outstandingBalance).toHaveTextContent('$7,875.00 USD')
    })

    it('display a XRP-denominated Loan in XRP currency', () => {
      const loans = [createMockLoan()]

      // This should not throw - currency defaults to XRP because XRP is the asset of the Vault.
      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency={defaultAsset.currency}
            displayCurrency={defaultDisplayCurrency}
            asset={defaultAsset}
            isCurrencySpecialSymbol={isCurrencyExoticSymbol(
              defaultAsset.currency,
            )}
          />
        </TestWrapper>,
      )

      // Verify the amount-requested and outstanding-balance cells display values
      const loanRow = container.querySelector('.loan-row')!
      const amountRequested = loanRow.querySelector('.amount-requested')
      const outstandingBalance = loanRow.querySelector('.outstanding-balance')
      expect(amountRequested).toHaveTextContent('\uE900 10.0K')
      expect(outstandingBalance).toHaveTextContent('\uE900 10.5K')
    })

    it(`display a XRP-denominated Loan in USD currency`, () => {
      const loans = [createMockLoan()]

      // This should not throw - currency defaults to XRP because XRP is the asset of the Vault.
      const { container } = render(
        <TestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency={defaultAsset.currency}
            displayCurrency="USD"
            asset={defaultAsset}
            isCurrencySpecialSymbol={isCurrencyExoticSymbol(
              defaultAsset.currency,
            )}
          />
        </TestWrapper>,
      )

      // Verify the amount-requested and outstanding-balance cells display values
      const loanRow = container.querySelector('.loan-row')!
      const amountRequested = loanRow.querySelector('.amount-requested')
      const outstandingBalance = loanRow.querySelector('.outstanding-balance')
      expect(amountRequested).toHaveTextContent('$15.0K USD')
      expect(outstandingBalance).toHaveTextContent('$15.8K USD')
    })
  })

  /**
   * =========================================
   * SECTION 11: Original Principal Traversal Tests
   * =========================================
   * Test the ledger history traversal that fetches the original loan principal.
   * These tests use SocketTestWrapper to enable the useQuery that calls getLedgerEntry.
   */
  describe('Original Principal Traversal', () => {
    beforeEach(() => {
      mockedGetLedgerEntry.mockReset()
    })

    it('traverses multiple ledger entries to find original principal', async () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_TRAVERSAL',
          PreviousTxnLgrSeq: 300,
          PrincipalOutstanding: '8000',
          TotalValueOutstanding: '8500',
        }),
      ]

      mockedGetLedgerEntry
        .mockResolvedValueOnce({
          node: { PreviousTxnLgrSeq: 200, PrincipalOutstanding: '9000' },
        })
        .mockResolvedValueOnce({
          node: { PreviousTxnLgrSeq: 100, PrincipalOutstanding: '10000' },
        })
        .mockRejectedValueOnce(new Error('ledger entry not found'))

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      await waitFor(() => {
        const loanRow = container.querySelector('.loan-row')!
        const amountRequested = loanRow.querySelector('.amount-requested')
        expect(amountRequested).toHaveTextContent('10.0K EUR')
      })

      const loanRow = container.querySelector('.loan-row')!
      const outstandingBalance = loanRow.querySelector('.outstanding-balance')
      expect(outstandingBalance).toHaveTextContent('8,500.00 EUR')
    })

    it('falls back to PrincipalOutstanding when first fetch throws (loan created one tx ago)', async () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_SINGLE_STEP',
          PreviousTxnLgrSeq: 150,
          PrincipalOutstanding: '9500',
          TotalValueOutstanding: '9800',
        }),
      ]

      mockedGetLedgerEntry.mockRejectedValueOnce(
        new Error('ledger entry not found'),
      )

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      await waitFor(() => {
        const loanRow = container.querySelector('.loan-row')!
        const amountRequested = loanRow.querySelector('.amount-requested')
        expect(amountRequested).toHaveTextContent('9,500.00 EUR')
      })
    })

    it('uses PrincipalOutstanding directly when no PreviousTxnLgrSeq exists', async () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_NO_PREV',
          PrincipalOutstanding: '10000',
          TotalValueOutstanding: '10500',
        }),
      ]

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      await waitFor(() => {
        const loanRow = container.querySelector('.loan-row')!
        const amountRequested = loanRow.querySelector('.amount-requested')
        expect(amountRequested).toHaveTextContent('10.0K EUR')
      })

      expect(mockedGetLedgerEntry).not.toHaveBeenCalled()
    })

    it('falls back to PrincipalOutstanding on generic error', async () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_ERROR',
          PreviousTxnLgrSeq: 300,
          PrincipalOutstanding: '8000',
          TotalValueOutstanding: '8500',
        }),
      ]

      mockedGetLedgerEntry.mockRejectedValue(new Error('network error'))

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      await waitFor(() => {
        const loanRow = container.querySelector('.loan-row')!
        const amountRequested = loanRow.querySelector('.amount-requested')
        expect(amountRequested).toHaveTextContent('8,000.00 EUR')
      })
    })

    it('stops traversal when PreviousTxnLgrSeq does not change (prevents infinite loop)', async () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_SAME_SEQ',
          PreviousTxnLgrSeq: 200,
          PrincipalOutstanding: '8000',
          TotalValueOutstanding: '8500',
        }),
      ]

      // Returns the same PreviousTxnLgrSeq — the guard should break the loop
      mockedGetLedgerEntry.mockResolvedValue({
        node: { PreviousTxnLgrSeq: 200, PrincipalOutstanding: '9000' },
      })

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      await waitFor(() => {
        const loanRow = container.querySelector('.loan-row')!
        const amountRequested = loanRow.querySelector('.amount-requested')
        expect(amountRequested).toHaveTextContent('9,000.00 EUR')
      })

      expect(mockedGetLedgerEntry).toHaveBeenCalledTimes(1)
    })

    it('shows loading state while traversal is in progress', () => {
      const loans = [
        createMockLoan({
          index: 'LOAN_LOADING',
          PreviousTxnLgrSeq: 300,
          PrincipalOutstanding: '8000',
          TotalValueOutstanding: '8500',
        }),
      ]

      // Never-resolving promise to keep the query in loading state
      mockedGetLedgerEntry.mockReturnValue(new Promise(() => {}))

      const { container } = render(
        <SocketTestWrapper>
          <BrokerLoansTable
            loans={loans}
            currency="EUR"
            displayCurrency="EUR"
            asset={{ currency: 'EUR', issuer: 'rTestIssuer' }}
          />
        </SocketTestWrapper>,
      )

      const loanRow = container.querySelector('.loan-row')!
      const amountRequested = loanRow.querySelector('.amount-requested')
      expect(amountRequested).toHaveTextContent('--')
    })
  })
})
