import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router'
import i18n from '../../../../../i18n/testConfigEnglish'
import { DexTradeTable, DexTradeFormatted } from '../DexTradeTable'

// Amount must be mocked — it uses useQuery(), SocketContext, and useAnalytics()
jest.mock('../../Amount', () => ({
  Amount: ({ value }: any) => <div>{value.amount}</div>,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

const mockDexTrades: DexTradeFormatted[] = [
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
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument()
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
    const page2Button = screen.getByRole('button', { name: '2' })
    fireEvent.click(page2Button)
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
    const tradesWithNullRate: DexTradeFormatted[] = [
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
    const rateCell = container.querySelector('tbody tr .tx-amount-rate')
    expect(rateCell?.textContent).toContain('--')
  })

  it('handles transactions without type', () => {
    const tradesWithoutType: DexTradeFormatted[] = [
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
    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument()
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
    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument()
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

  it('hides type column when hideType is true', () => {
    const { container } = render(
      <TestWrapper>
        <DexTradeTable
          transactions={mockDexTrades}
          totalTrades={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
          hideType
        />
      </TestWrapper>,
    )
    const headers = container.querySelectorAll('thead th')
    expect(headers.length).toBe(8)
    expect(screen.queryByText('Order Book')).not.toBeInTheDocument()
    expect(screen.queryByText('AMM')).not.toBeInTheDocument()
  })

  it('handles single transaction', () => {
    const singleTrade: DexTradeFormatted[] = [mockDexTrades[0]]
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
    const accounts = screen.getAllByTestId('account')
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
    expect(accounts[1]).toHaveTextContent('rLNaPoK...4dc6w')
  })
})
