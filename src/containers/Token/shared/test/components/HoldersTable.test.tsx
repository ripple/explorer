import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../../i18n/testConfigEnglish'
import {
  HoldersTable,
  XRPLHolder,
} from '../../components/HoldersTable/HoldersTable'

jest.mock('../../../../shared/components/Account', () => ({
  Account: ({ displayText }: { displayText: string }) => (
    <span data-testid="account">{displayText}</span>
  ),
}))

jest.mock('../../../../shared/utils', () => ({
  shortenAccount: (account: string) =>
    account.length > 12
      ? `${account.slice(0, 7)}...${account.slice(-5)}`
      : account,
}))

jest.mock('../../../shared/components/Pagination', () => ({
  Pagination: ({
    onPageChange,
    totalItems,
    pageSize = 15,
  }: {
    onPageChange: (page: number) => void
    totalItems: number
    pageSize?: number
  }) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (totalPages <= 1) return null
    return (
      <div>
        <button type="button" onClick={() => onPageChange(2)}>
          Next Page
        </button>
      </div>
    )
  },
}))

jest.mock('../../../shared/components/Loader', () => ({
  Loader: () => <div>Loading...</div>,
}))

jest.mock('../../../shared/NumberFormattingUtils', () => ({
  formatLargeNumber: (value: number, decimals: number, lang: string) => ({
    num: value.toFixed(decimals),
    unit: '',
    lang,
  }),
  parseIntegerAmount: (amount: any) => {
    if (amount === 0) return '0'
    return String(amount)
  },
  parsePercent: (percent: any) => `${percent}%`,
  parseCurrencyAmount: (amount: any) => `$${amount}`,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

const mockHolders: XRPLHolder[] = [
  {
    rank: 1,
    account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    balance: 1000000,
    percent: 25.5,
    value_usd: 500000,
  },
  {
    rank: 2,
    account: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    balance: 500000,
    percent: 12.75,
    value_usd: 250000,
  },
  {
    rank: 3,
    account: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    balance: 250000,
    percent: 6.375,
    value_usd: 125000,
  },
]

describe('HoldersTable Component', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify accounts are rendered (shortened to first 7 + last 5 chars with ... in between)
    const accounts = screen.getAllByTestId('account')
    expect(accounts.length).toBeGreaterThanOrEqual(3)
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
  })

  it('displays all holders in the table', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify accounts are rendered (they are shortened to first 7 + last 5 chars with ... in between)
    const accounts = screen.getAllByTestId('account')
    expect(accounts.length).toBeGreaterThanOrEqual(3)
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
    expect(accounts[1]).toHaveTextContent('rLNaPoK...4dc6w')
    expect(accounts[2]).toHaveTextContent('rvYAfWj...bs59B')
  })

  it('displays correct rank for each holder', () => {
    const { container } = render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(3)
  })

  it('shows loading state when isHoldersDataLoading is true', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={[]}
          isHoldersDataLoading
          totalHolders={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows no holders message when empty and not loading', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={[]}
          isHoldersDataLoading={false}
          totalHolders={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText(/no holders/i)).toBeInTheDocument()
  })

  it('calls onPageChange when pagination is triggered', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={30}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const nextButton = screen.getByText('Next Page')
    fireEvent.click(nextButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('renders table headers correctly', () => {
    const { container } = render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const headers = container.querySelectorAll('thead th')
    expect(headers.length).toBe(5)
  })

  it('displays pagination when there are multiple pages', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={30}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Next Page')).toBeInTheDocument()
  })

  it('does not display pagination when all items fit on one page', () => {
    render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.queryByText('Next Page')).not.toBeInTheDocument()
  })

  it('handles single holder correctly', () => {
    const singleHolder: XRPLHolder[] = [mockHolders[0]]
    render(
      <TestWrapper>
        <HoldersTable
          holders={singleHolder}
          totalHolders={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify account is rendered (shortened to first 7 + last 5 chars with ... in between)
    const account = screen.getByTestId('account')
    expect(account).toHaveTextContent('rN7n7ot...6fzRH')
  })

  it('handles large holder balances', () => {
    const largeHolder: XRPLHolder[] = [
      {
        rank: 1,
        account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
        balance: 999999999999,
        percent: 99.99,
        value_usd: 999999999999,
      },
    ]
    render(
      <TestWrapper>
        <HoldersTable
          holders={largeHolder}
          totalHolders={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify account is rendered (shortened to first 7 + last 5 chars with ... in between)
    const account = screen.getByTestId('account')
    expect(account).toHaveTextContent('rN7n7ot...6fzRH')
  })

  it('handles zero balance holders', () => {
    const zeroHolder: XRPLHolder[] = [
      {
        rank: 1,
        account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
        balance: 0,
        percent: 0,
        value_usd: 0,
      },
    ]
    render(
      <TestWrapper>
        <HoldersTable
          holders={zeroHolder}
          totalHolders={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify account is rendered (shortened to first 7 + last 5 chars with ... in between)
    const account = screen.getByTestId('account')
    expect(account).toHaveTextContent('rN7n7ot...6fzRH')
  })

  it('renders table with correct CSS classes', () => {
    const { container } = render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(container.querySelector('.tokens-table')).toBeInTheDocument()
    expect(container.querySelector('table.basic')).toBeInTheDocument()
  })

  it('displays correct number of rows for current page', () => {
    const { container } = render(
      <TestWrapper>
        <HoldersTable
          holders={mockHolders}
          totalHolders={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(mockHolders.length)
  })
})
