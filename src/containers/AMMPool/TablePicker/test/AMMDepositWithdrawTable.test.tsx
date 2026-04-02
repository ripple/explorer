import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { AMMDepositWithdrawTable } from '../AMMDepositWithdrawTable'
import { AMMDepositWithdrawTx } from '../../types'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

interface RenderProps {
  transactions?: AMMDepositWithdrawTx[]
  isLoading?: boolean
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  hasMore?: boolean
  type?: 'deposit' | 'withdraw'
}

const renderComponent = ({
  transactions = [],
  isLoading = false,
  totalItems = 20,
  currentPage = 1,
  onPageChange = jest.fn(),
  pageSize = 10,
  hasMore = true,
  type = 'deposit',
}: RenderProps = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <AMMDepositWithdrawTable
            transactions={transactions}
            isLoading={isLoading}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            hasMore={hasMore}
            type={type}
          />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  )

describe('AMMDepositWithdrawTable', () => {
  const mockTransactions: AMMDepositWithdrawTx[] = [
    {
      hash: 'ABC123DEF456ABC123DEF456ABC123DEF456ABC123DEF456ABC123DEF456ABCD',
      ledger: 100141108,
      timestamp: 827617760,
      account: 'rP9f2dDqH7zX1234567890123456789012',
      asset: {
        currency: '524C555344000000000000000000000000000000',
        issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
        amount: 246,
      },
      asset2: { currency: 'XRP', amount: 113.73 },
      lpTokens: '12845',
      valueUsd: 362500,
    },
    {
      hash: 'DEF789GHI012DEF789GHI012DEF789GHI012DEF789GHI012DEF789GHI012DEFG',
      ledger: 100141109,
      timestamp: 827617800,
      account: 'rMeP9RditJ3j1234567890123456789012',
      asset: null,
      asset2: { currency: 'XRP', amount: 88.63 },
      lpTokens: '5912',
      valueUsd: null,
    },
  ]

  it('renders column headers', () => {
    renderComponent({ transactions: mockTransactions })
    expect(screen.getByText('tx_hash')).toBeInTheDocument()
    expect(screen.getByText('ledger')).toBeInTheDocument()
    expect(screen.getByText('timestamp')).toBeInTheDocument()
    expect(screen.getByText('account')).toBeInTheDocument()
    expect(screen.getByText('asset')).toBeInTheDocument()
    expect(screen.getByText('asset_2')).toBeInTheDocument()
    expect(screen.getByText('lp_tokens_received')).toBeInTheDocument()
    expect(screen.getByText('usd_value')).toBeInTheDocument()
  })

  it('shows lp_tokens_redeemed for withdraw type', () => {
    renderComponent({ transactions: mockTransactions, type: 'withdraw' })
    expect(screen.getByText('lp_tokens_redeemed')).toBeInTheDocument()
  })

  it('renders transaction rows', () => {
    const { container } = renderComponent({ transactions: mockTransactions })
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('shows -- for missing asset (single-asset deposit)', () => {
    renderComponent({ transactions: mockTransactions })
    const rows = document.querySelectorAll('tbody tr')
    expect(rows[1].querySelector('.tx-asset')).toHaveTextContent('--')
  })

  it('shows -- for missing USD value', () => {
    renderComponent({ transactions: mockTransactions })
    const rows = document.querySelectorAll('tbody tr')
    expect(rows[1].querySelector('.tx-usd-value')).toHaveTextContent('--')
  })

  it('renders data notice banner', () => {
    renderComponent({ transactions: mockTransactions })
    expect(document.querySelector('.data-notice')).toBeInTheDocument()
  })

  it('shows loader when loading', () => {
    const { container } = renderComponent({ isLoading: true })
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  it('shows empty message when no deposit transactions', () => {
    renderComponent()
    expect(screen.getByText('no_deposits')).toBeInTheDocument()
  })

  it('shows withdrawal empty message for withdraw type', () => {
    renderComponent({ type: 'withdraw' })
    expect(screen.getByText('no_withdrawals')).toBeInTheDocument()
  })

  it('renders ledger as a link', () => {
    renderComponent({ transactions: mockTransactions })
    const ledgerLink = screen.getByText('100141108')
    expect(ledgerLink.closest('a')).toHaveAttribute(
      'href',
      '/ledgers/100141108',
    )
  })
})
