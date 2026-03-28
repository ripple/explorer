import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfig'
import { AMMDepositWithdrawTable } from '../TablePicker/AMMDepositWithdrawTable'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderComponent = (props: any) =>
  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <AMMDepositWithdrawTable {...props} />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  )

describe('AMMDepositWithdrawTable', () => {
  const mockTransactions = [
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

  const defaultProps = {
    transactions: mockTransactions,
    isLoading: false,
    totalItems: 20,
    currentPage: 1,
    onPageChange: jest.fn(),
    pageSize: 10,
    hasMore: true,
    type: 'deposit' as const,
  }

  it('renders column headers', () => {
    renderComponent(defaultProps)
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
    renderComponent({ ...defaultProps, type: 'withdraw' })
    expect(screen.getByText('lp_tokens_redeemed')).toBeInTheDocument()
  })

  it('renders transaction rows', () => {
    const { container } = renderComponent(defaultProps)
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('shows -- for missing asset (single-asset deposit)', () => {
    renderComponent(defaultProps)
    const rows = document.querySelectorAll('tbody tr')
    expect(rows[1].querySelector('.tx-asset')).toHaveTextContent('--')
  })

  it('shows -- for missing USD value', () => {
    renderComponent(defaultProps)
    const rows = document.querySelectorAll('tbody tr')
    expect(rows[1].querySelector('.tx-usd-value')).toHaveTextContent('--')
  })

  it('renders data notice banner', () => {
    renderComponent(defaultProps)
    expect(document.querySelector('.data-notice')).toBeInTheDocument()
  })

  it('shows loader when loading', () => {
    const { container } = renderComponent({
      ...defaultProps,
      isLoading: true,
    })
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  it('shows empty message when no deposit transactions', () => {
    renderComponent({ ...defaultProps, transactions: [] })
    expect(screen.getByText('no_deposits')).toBeInTheDocument()
  })

  it('shows withdrawal empty message for withdraw type', () => {
    renderComponent({
      ...defaultProps,
      transactions: [],
      type: 'withdraw',
    })
    expect(screen.getByText('no_withdrawals')).toBeInTheDocument()
  })

  it('renders ledger as a link', () => {
    renderComponent(defaultProps)
    const ledgerLink = screen.getByText('100141108')
    expect(ledgerLink.closest('a')).toHaveAttribute(
      'href',
      '/ledgers/100141108',
    )
  })
})
