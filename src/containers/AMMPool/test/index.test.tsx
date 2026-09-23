import { render, screen, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { AMMPool } from '../index'
import { QuickHarness } from '../../test/utils'
import { AMM_POOL_ROUTE } from '../../App/routes'
import * as rippled from '../../../rippled/lib/rippled'
import * as ammUtils from '../utils'

jest.mock('../../../rippled/lib/rippled')
jest.mock('../utils')
jest.mock('../api', () => ({
  fetchAMMPoolData: jest.fn().mockRejectedValue(new Error('not available')),
  fetchAMMCreatedTimestamp: jest.fn().mockResolvedValue(827000000),
  fetchAMMHistoricalTrends: jest.fn().mockResolvedValue({ data_points: [] }),
  fetchAMMDexTrades: jest.fn().mockResolvedValue({ data: [], total: 0 }),
  fetchAMMTransactions: jest.fn().mockResolvedValue({ data: [], total: 0 }),
}))

// TVLVolumeChart must be mocked — it uses useQuery() + recharts (won't render in jsdom)
jest.mock('../../shared/components/TVLVolumeChart', () => ({
  TVLVolumeChart: () => <div data-testid="tvl-volume-chart">Chart</div>,
}))

// AMMPoolTablePicker must be mocked — it uses useQuery(), useInfiniteQuery(), SocketContext, useAnalytics()
jest.mock('../TablePicker', () => ({
  AMMPoolTablePicker: () => <div data-testid="table-picker">Table Picker</div>,
}))

const mockGetAMMInfo = rippled.getAMMInfoByAMMAccount as jest.Mock
const mockDetectDeleted = ammUtils.getDeletedAMMData as jest.Mock

const TEST_AMM_ID = 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG'

const mockAmmInfoResponse = {
  amm: {
    amount: '500000000', // XRP in drops
    amount2: {
      currency: '524C555344000000000000000000000000000000',
      issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
      value: '1000',
    },
    trading_fee: 500,
    lp_token: {
      currency: '03CE60C3DB22CF7F7157810936F27A5B485C8DB9',
      issuer: TEST_AMM_ID,
      value: '10000',
    },
    auction_slot: {
      account: 'rSomeAccount',
      expiration: '2026-12-31T00:00:00+0000',
      discounted_fee: 100,
      price: { value: '50', currency: 'LP', issuer: TEST_AMM_ID },
      time_interval: 3,
    },
  },
}

describe('AMMPool Page', () => {
  const renderComponent = (ammAccountId = TEST_AMM_ID) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/amm/${ammAccountId}`]}>
        <Route path={AMM_POOL_ROUTE.path} element={<AMMPool />} />
      </QuickHarness>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VITE_ENVIRONMENT = 'mainnet'
    mockDetectDeleted.mockResolvedValue(null)
  })

  it('renders header and cards for an active AMM pool', async () => {
    mockGetAMMInfo.mockResolvedValue(mockAmmInfoResponse)

    renderComponent()

    await waitFor(() => {
      expect(document.querySelector('.amm-pool-header')).toBeInTheDocument()
      expect(screen.getByText('basic_info')).toBeInTheDocument()
      expect(screen.getByText('auction')).toBeInTheDocument()
      expect(screen.getByTestId('table-picker')).toBeInTheDocument()
    })
  })

  it('renders token pair in header with XRP on the right', async () => {
    mockGetAMMInfo.mockResolvedValue(mockAmmInfoResponse)

    renderComponent()

    await waitFor(() => {
      const header = document.querySelector('.amm-pool-header')
      expect(header).toBeInTheDocument()
      // XRP should be asset2 (right side)
      expect(header!.textContent).toContain('/XRP')
    })
  })

  it('shows deleted banner for a deleted AMM pool', async () => {
    mockGetAMMInfo.mockRejectedValue({ code: 35 })
    mockDetectDeleted.mockResolvedValue({
      account: 'rDeletedAMM',
      asset: { currency: 'XRP' },
      asset2: {
        currency: '504958454C530000000000000000000000000000',
        issuer: 'rNEQb5e4DZUJG48xKPstDWjmm1PQ4fcUfZ',
      },
      lpToken: {
        currency: '0370963F20A61AF3C6E5D674EAAEE3E65C0BDC9F',
        issuer: 'rDeletedAMM',
        value: '0',
      },
      deletionDate: 827617760,
    })

    renderComponent('rDeletedAMM')

    await waitFor(() => {
      expect(document.querySelector('.amm-pool-header')).toBeInTheDocument()
      expect(screen.getByText('basic_info')).toBeInTheDocument()
      expect(screen.getByTestId('table-picker')).toBeInTheDocument()
    })

    // Liquidated banner should be shown
    await waitFor(() => {
      const banner = document.querySelector('.amm-deleted-banner')
      expect(banner).toBeInTheDocument()
    })
  })

  it('hides auction card for deleted pools', async () => {
    mockGetAMMInfo.mockRejectedValue({ code: 35 })
    mockDetectDeleted.mockResolvedValue({
      account: 'rDeletedAMM',
      asset: { currency: 'XRP' },
      asset2: {
        currency: '504958454C530000000000000000000000000000',
        issuer: 'rNEQb5e4DZUJG48xKPstDWjmm1PQ4fcUfZ',
      },
      lpToken: {
        currency: '0370963F20A61AF3C6E5D674EAAEE3E65C0BDC9F',
        issuer: 'rDeletedAMM',
        value: '0',
      },
      deletionDate: 827617760,
    })

    renderComponent('rDeletedAMM')

    await waitFor(() => {
      expect(screen.getByText('basic_info')).toBeInTheDocument()
    })

    // Auction card should not be rendered for deleted pools
    expect(screen.queryByText('auction')).not.toBeInTheDocument()
  })

  it('shows error when both amm_info and deletion detection fail', async () => {
    mockGetAMMInfo.mockRejectedValue({ code: 404 })
    mockDetectDeleted.mockResolvedValue(null)

    renderComponent('rNonExistentAMM')

    await waitFor(() => {
      expect(document.querySelector('.amm-pool-header')).not.toBeInTheDocument()
    })
  })
})
