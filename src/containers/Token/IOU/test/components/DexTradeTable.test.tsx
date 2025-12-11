import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../../i18n/testConfigEnglish'
import {
  DexTradeTable,
  LOSDEXTransaction,
} from '../../components/DexTradeTable/DexTradeTable'

jest.mock('../../../shared/components/Account', () => ({
  Account: ({ displayText }: { displayText: string }) => (
    <span data-testid="account">{displayText}</span>
  ),
}))

jest.mock('../../../shared/components/Amount', () => ({
  Amount: ({ value }: any) => <div>{value.amount}</div>,
}))

jest.mock('../../../shared/components/Currency', () => ({
  __esModule: true,
  default: ({ currency }: { currency: string }) => <div>{currency}</div>,
}))

jest.mock('../../../shared/components/Tooltip', () => ({
  useTooltip: () => ({
    tooltip: null,
    showTooltip: jest.fn(),
    hideTooltip: jest.fn(),
  }),
  Tooltip: () => null,
}))

jest.mock('../../../shared/utils', () => ({
  shortenAccount: (account: string) =>
    account.length > 12
      ? `${account.slice(0, 7)}...${account.slice(-5)}`
      : account,
  shortenTxHash: (hash: string) =>
    hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : hash,
}))

jest.mock('../../../shared/hooks', () => ({
  useLanguage: () => 'en',
}))

jest.mock('../../../shared/components/ResponsiveTimestamp', () => ({
  ResponsiveTimestamp: ({ timestamp }: { timestamp: number }) => (
    <div>{new Date(timestamp * 1000).toISOString()}</div>
  ),
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
  parseAmount: (amount: any) => String(amount),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

const mockDexTrades: LOSDEXTransaction[] = [
  {
    hash: 'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879',
    ledger: 12345,
    timestamp: 1609459200,
    from: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    to: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    amount_in: {
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      amount: '100',
    },
    amount_out: {
      currency: 'XRP',
      issuer: '',
      amount: '500',
    },
    rate: 5,
    type: 'orderBook',
  },
  {
    hash: 'F4GF7FB4E49F1D3C740559131FB5G04E4G5G9GGEC354B963B1G60288C32C5980',
    ledger: 12346,
    timestamp: 1609545600,
    from: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    to: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    amount_in: {
      currency: 'XRP',
      issuer: '',
      amount: '1000',
    },
    amount_out: {
      currency: 'EUR',
      issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      amount: '200',
    },
    rate: 0.2,
    type: 'amm',
  },
]

describe('DexTradeTable Component', () => {
  const mockOnPageChange = jest.fn()
  const mockOnRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify tx hash is rendered (shortened to first 6 + last 6 chars with ... in between)
    expect(screen.getByText('E3FE6E...1B4879')).toBeInTheDocument()
  })

  it('displays all transactions in the table', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify accounts are rendered (they are shortened to first 7 + last 5 chars with ... in between)
    const accounts = screen.getAllByTestId('account')
    expect(accounts.length).toBeGreaterThanOrEqual(2)
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
    expect(accounts[1]).toHaveTextContent('rLNaPoK...4dc6w')
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={[]}
          isLoading
          totalTrades={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows no trades message when empty and not loading', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={[]}
          isLoading={false}
          totalTrades={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText(/no dex trades found/i)).toBeInTheDocument()
    expect(screen.getByText('no_info.svg')).toBeInTheDocument()
  })

  it('calls onPageChange when pagination is triggered', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={20}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
          hasMore
        />
      </TestWrapper>,
    )
    const nextButton = screen.getByText('Next Page')
    fireEvent.click(nextButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('displays correct DEX type for orderBook', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Order Book')).toBeInTheDocument()
  })

  it('displays correct DEX type for AMM', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('AMM')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    const { container } = render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const headers = container.querySelectorAll('thead th')
    expect(headers.length).toBe(9)
  })

  it('displays refresh button when transactions exist', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
          onRefresh={mockOnRefresh}
        />
      </TestWrapper>,
    )
    const refreshButton = screen.getByTitle(/refresh/i)
    expect(refreshButton).toBeInTheDocument()
  })

  it('calls onRefresh when refresh button is clicked', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
          onRefresh={mockOnRefresh}
        />
      </TestWrapper>,
    )
    const refreshButton = screen.getByTitle(/refresh/i)
    fireEvent.click(refreshButton)
    expect(mockOnRefresh).toHaveBeenCalled()
  })

  it('handles transactions with null rate', () => {
    const tradesWithNullRate: LOSDEXTransaction[] = [
      {
        ...mockDexTrades[0],
        rate: null,
      },
    ]
    const { container } = render(
      <TestWrapper>
        <DexTradeTable
          transactions={tradesWithNullRate}
          totalTrades={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Check that the rate cell in tbody contains '--'
    const rateCell = container.querySelector('tbody tr .tx-amount-rate')
    expect(rateCell?.textContent).toContain('--')
  })

  it('handles transactions without type', () => {
    const tradesWithoutType: LOSDEXTransaction[] = [
      {
        ...mockDexTrades[0],
        type: undefined,
      },
    ]
    const { container } = render(
      <TestWrapper>
        <DexTradeTable
          transactions={tradesWithoutType}
          totalTrades={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // When type is undefined, formatDexType returns '--'
    const typeCell = container.querySelector('tbody tr .tx-type')
    expect(typeCell?.textContent).toBe('--')
  })

  it('displays pagination when hasMore is true', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={20}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
          hasMore
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Next Page')).toBeInTheDocument()
  })

  it('displays pagination when hasPrevPage is true', () => {
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={20}
          currentPage={2}
          onPageChange={mockOnPageChange}
          pageSize={10}
          hasPrevPage
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Next Page')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    const { container } = render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(mockDexTrades.length)
  })

  it('handles single transaction', () => {
    const singleTrade: LOSDEXTransaction[] = [mockDexTrades[0]]
    render(
      <TestWrapper>
        <DexTradeTable
          transactions={singleTrade}
          totalTrades={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify account is rendered (shortened to first 7 + last 5 chars with ... in between)
    const accounts = screen.getAllByTestId('account')
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
    expect(accounts[1]).toHaveTextContent('rLNaPoK...4dc6w')
  })
})
