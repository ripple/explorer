import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfig'
import { TVLVolumeChart } from '../TVLVolumeChart'
import { TooltipProvider } from '../../../shared/components/Tooltip'
import * as api from '../../api'

// ResizeObserver is not available in jsdom (required by recharts ResponsiveContainer)
function MockResizeObserver() {
  return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() }
}
beforeAll(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
})

jest.mock('../../api')

const mockFetchHistoricalTrends = api.fetchAMMHistoricalTrends as jest.Mock

const mockTrendsData = {
  data_points: [
    {
      date: '2026-03-25',
      tvl_xrp: 5000000,
      tvl_usd: 7000000,
      trading_volume_xrp: 500,
      trading_volume_usd: 700,
    },
    {
      date: '2026-03-26',
      tvl_xrp: 5100000,
      tvl_usd: 7100000,
      trading_volume_xrp: 600,
      trading_volume_usd: 800,
    },
    {
      date: '2026-03-27',
      tvl_xrp: 5200000,
      tvl_usd: 7200000,
      trading_volume_xrp: 400,
      trading_volume_usd: 550,
    },
  ],
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

interface RenderProps {
  ammAccountId?: string
  displayCurrency?: 'usd' | 'xrp'
  setDisplayCurrency?: (currency: 'usd' | 'xrp') => void
}

const renderComponent = ({
  ammAccountId = 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG',
  displayCurrency = 'usd',
  setDisplayCurrency = jest.fn(),
}: RenderProps = {}) =>
  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <TVLVolumeChart
            ammAccountId={ammAccountId}
            displayCurrency={displayCurrency}
            setDisplayCurrency={setDisplayCurrency}
          />
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>,
  )

describe('TVLVolumeChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    mockFetchHistoricalTrends.mockResolvedValue(mockTrendsData)
  })

  it('renders chart section title', () => {
    renderComponent()
    expect(screen.getByText('tvl_and_volume')).toBeInTheDocument()
  })

  it('renders currency toggle labels', () => {
    renderComponent()
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText('XRP')).toBeInTheDocument()
  })

  it('renders TVL and Volume checkboxes', () => {
    renderComponent()
    const checkboxes = screen.getAllByRole('checkbox')
    // Toggle + TVL checkbox + Volume checkbox = 3
    expect(checkboxes.length).toBe(3)
  })

  it('renders all time range buttons', () => {
    renderComponent()
    expect(screen.getByText('1W')).toBeInTheDocument()
    expect(screen.getByText('1M')).toBeInTheDocument()
    expect(screen.getByText('6M')).toBeInTheDocument()
    expect(screen.getByText('1Y')).toBeInTheDocument()
    expect(screen.getByText('5Y')).toBeInTheDocument()
  })

  it('fetches data with default time range 6M', async () => {
    renderComponent()

    await waitFor(() => {
      expect(mockFetchHistoricalTrends).toHaveBeenCalledWith(
        'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG',
        '6M',
      )
    })
  })

  it('fetches data with new time range when button is clicked', async () => {
    renderComponent()

    await waitFor(() => {
      expect(mockFetchHistoricalTrends).toHaveBeenCalled()
    })

    await userEvent.click(screen.getByText('1W'))

    await waitFor(() => {
      expect(mockFetchHistoricalTrends).toHaveBeenCalledWith(
        'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG',
        '1W',
      )
    })
  })

  it('calls setDisplayCurrency when toggle is clicked', async () => {
    const setDisplayCurrency = jest.fn()
    renderComponent({ setDisplayCurrency })

    const toggle = screen.getByLabelText('Toggle currency')
    await userEvent.click(toggle)

    expect(setDisplayCurrency).toHaveBeenCalledWith('xrp')
  })

  it('renders chart legend', () => {
    renderComponent()
    const legends = document.querySelectorAll('.legend-text')
    expect(legends.length).toBe(2)
  })

  it('uses cached data when switching back to a previously fetched range', async () => {
    renderComponent()

    await waitFor(() => {
      expect(mockFetchHistoricalTrends).toHaveBeenCalledTimes(1)
    })

    // Switch to 1W
    await userEvent.click(screen.getByText('1W'))
    await waitFor(() => {
      expect(mockFetchHistoricalTrends).toHaveBeenCalledTimes(2)
    })

    // Switch back to 6M — should use cache, not refetch
    await userEvent.click(screen.getByText('6M'))
    expect(mockFetchHistoricalTrends).toHaveBeenCalledTimes(2)
  })
})
