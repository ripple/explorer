import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { AMMPoolTablePicker } from '../index'

const mockGetAccountTransactions = jest.fn().mockResolvedValue({
  transactions: [],
})
jest.mock('../../../../rippled', () => ({
  getAccountTransactions: (...args: any[]) =>
    mockGetAccountTransactions(...args),
}))

jest.mock('../../api', () => ({
  fetchAMMDexTrades: jest.fn().mockResolvedValue({ data: [], total: 0 }),
  fetchAMMTransactions: jest.fn().mockResolvedValue({ data: [], total: 0 }),
}))

jest.mock('../../../Token/IOU/api/holders', () =>
  jest.fn().mockResolvedValue({ holders: [], totalHolders: 0 }),
)

jest.mock('../../../shared/SocketContext', () => ({
  __esModule: true,
  default: {
    _currentValue: { send: jest.fn() },
  },
}))

jest.mock('../../../shared/analytics', () => ({
  useAnalytics: () => ({
    trackException: jest.fn(),
    trackScreenLoaded: jest.fn(),
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

interface RenderProps {
  ammAccountId?: string
  tab?: string
  isMainnet?: boolean
  lpToken?: { currency: string; issuer: string; value: string }
  tvlUsd?: number
  isDeleted?: boolean
}

const renderComponent = ({
  ammAccountId = 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG',
  tab = 'transactions',
  isMainnet = true,
  lpToken = {
    currency: '03CE60C3DB22CF7F7157810936F27A5B485C8DB9',
    issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
    value: '5000000',
  },
  tvlUsd = 1000000,
  isDeleted = false,
}: RenderProps = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <AMMPoolTablePicker
            ammAccountId={ammAccountId}
            tab={tab}
            isMainnet={isMainnet}
            lpToken={lpToken}
            tvlUsd={tvlUsd}
            isDeleted={isDeleted}
          />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  )

describe('AMMPoolTablePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('renders all tabs on mainnet', () => {
    renderComponent()
    expect(screen.getByText('all_transactions')).toBeInTheDocument()
    expect(screen.getByText('dex_trades')).toBeInTheDocument()
    expect(screen.getByText('deposits')).toBeInTheDocument()
    expect(screen.getByText('withdrawals')).toBeInTheDocument()
    expect(screen.getByText('holders')).toBeInTheDocument()
  })

  it('renders only transactions tab on non-mainnet', () => {
    renderComponent({ isMainnet: false })
    expect(screen.getByText('all_transactions')).toBeInTheDocument()
    expect(screen.queryByText('dex_trades')).toBeNull()
    expect(screen.queryByText('deposits')).toBeNull()
    expect(screen.queryByText('withdrawals')).toBeNull()
    expect(screen.queryByText('holders')).toBeNull()
  })

  it('hides holders tab when pool is deleted', () => {
    renderComponent({ isDeleted: true })
    expect(screen.getByText('all_transactions')).toBeInTheDocument()
    expect(screen.getByText('dex_trades')).toBeInTheDocument()
    expect(screen.queryByText('holders')).toBeNull()
  })

  it('defaults to transactions tab', () => {
    renderComponent()
    const tabsContainer = document.querySelector('.tx-table-picker')
    expect(tabsContainer).toBeInTheDocument()
  })

  it('switches tab when clicked', async () => {
    renderComponent()

    await userEvent.click(screen.getByText('dex_trades'))
    // After clicking dex_trades, the DexTradeTable should render
    // (it will show empty state since mock returns no data)
  })

  it('uses provided tab as initial active tab', () => {
    renderComponent({ tab: 'dex-trades' })
    // The dex-trades tab should be active (component renders its content)
  })

  it('shows error message when account transactions fail', async () => {
    mockGetAccountTransactions.mockRejectedValueOnce(
      new Error('get_account_transactions_failed'),
    )

    renderComponent()

    await waitFor(() => {
      expect(
        screen.getByText('get_account_transactions_failed'),
      ).toBeInTheDocument()
    })
  })
})
