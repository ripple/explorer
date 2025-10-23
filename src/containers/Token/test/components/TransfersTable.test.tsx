import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import {
  TransfersTable,
  LOSTransfer,
} from '../../components/TransfersTable/TransfersTable'

jest.mock('../../../shared/components/Account', () => ({
  Account: ({ displayText }: { displayText: string }) => (
    <span data-testid="account">{displayText}</span>
  ),
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

jest.mock('../../components/ResponsiveTimestamp', () => ({
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

const mockTransfers: LOSTransfer[] = [
  {
    hash: 'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879',
    ledger: 12345,
    action: 'send',
    timestamp: 1609459200,
    from: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    to: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    amount: {
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      value: '100',
    },
  },
  {
    hash: 'F4GF7FB4E49F1D3C740559131FB5G04E4G5G9GGEC354B963B1G60288C32C5980',
    ledger: 12346,
    action: 'receive',
    timestamp: 1609545600,
    from: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
    to: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    amount: {
      currency: 'EUR',
      issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      value: '200',
    },
  },
]

describe('TransfersTable Component', () => {
  const mockOnPageChange = jest.fn()
  const mockOnRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify tx hash is rendered (shortened to first 6 + last 6 chars with ... in between)
    expect(screen.getByText('E3FE6E...1B4879')).toBeInTheDocument()
  })

  it('displays all transfers in the table', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
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

  it('shows loading state when isTransfersLoading is true', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={[]}
          isTransfersLoading
          totalTransfers={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows no transfers message when empty and not loading', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={[]}
          isTransfersLoading={false}
          totalTransfers={0}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText(/no transfers/i)).toBeInTheDocument()
  })

  it('calls onPageChange when pagination is triggered', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={20}
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

  it('displays action pill for each transfer', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('send')).toBeInTheDocument()
    expect(screen.getByText('receive')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    const { container } = render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const headers = container.querySelectorAll('thead th')
    expect(headers.length).toBe(7)
  })

  it('displays refresh button when transfers exist', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
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
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
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

  it('handles transfers with missing from address', () => {
    const transferWithoutFrom: LOSTransfer[] = [
      {
        ...mockTransfers[0],
        from: '',
      },
    ]
    render(
      <TestWrapper>
        <TransfersTable
          transactions={transferWithoutFrom}
          totalTransfers={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('handles transfers with missing to address', () => {
    const transferWithoutTo: LOSTransfer[] = [
      {
        ...mockTransfers[0],
        to: '',
      },
    ]
    render(
      <TestWrapper>
        <TransfersTable
          transactions={transferWithoutTo}
          totalTransfers={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('handles transfers with missing amount', () => {
    const transferWithoutAmount: LOSTransfer[] = [
      {
        ...mockTransfers[0],
        amount: {
          currency: '',
          issuer: '',
          value: '',
        },
      },
    ]
    render(
      <TestWrapper>
        <TransfersTable
          transactions={transferWithoutAmount}
          totalTransfers={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('displays pagination when hasMore is true', () => {
    render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={20}
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
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={20}
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
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(mockTransfers.length)
  })

  it('handles single transfer', () => {
    const singleTransfer: LOSTransfer[] = [mockTransfers[0]]
    render(
      <TestWrapper>
        <TransfersTable
          transactions={singleTransfer}
          totalTransfers={1}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    // Verify accounts are rendered (shortened to first 7 + last 5 chars with ... in between)
    const accounts = screen.getAllByTestId('account')
    expect(accounts[0]).toHaveTextContent('rN7n7ot...6fzRH')
    expect(accounts[1]).toHaveTextContent('rLNaPoK...4dc6w')
  })

  it('renders table with correct CSS classes', () => {
    const { container } = render(
      <TestWrapper>
        <TransfersTable
          transactions={mockTransfers}
          totalTransfers={2}
          currentPage={1}
          onPageChange={mockOnPageChange}
          pageSize={10}
        />
      </TestWrapper>,
    )
    expect(container.querySelector('.tokens-table')).toBeInTheDocument()
    expect(container.querySelector('table.basic')).toBeInTheDocument()
  })
})
