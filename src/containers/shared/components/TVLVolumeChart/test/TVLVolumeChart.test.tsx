import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { TVLVolumeChart } from '../TVLVolumeChart'
import { TooltipProvider } from '../../Tooltip'

// ResizeObserver is not available in jsdom (required by recharts ResponsiveContainer)
function MockResizeObserver() {
  return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() }
}
beforeAll(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
})

const mockData = [
  { date: '2026-03-25', tvl: 7000000, volume: 700 },
  { date: '2026-03-26', tvl: 7100000, volume: 800 },
  { date: '2026-03-27', tvl: 7200000, volume: 550 },
]

interface RenderProps {
  data?: { date: string; tvl: number; volume: number }[]
  isLoading?: boolean
  displayCurrency?: 'usd' | 'xrp'
  setDisplayCurrency?: (currency: 'usd' | 'xrp') => void
  onTimeRangeChange?: (range: string) => void
}

const renderComponent = ({
  data = mockData,
  isLoading = false,
  displayCurrency = 'usd',
  setDisplayCurrency = jest.fn(),
  onTimeRangeChange = jest.fn(),
}: RenderProps = {}) =>
  render(
    <I18nextProvider i18n={i18n}>
      <TooltipProvider>
        <TVLVolumeChart
          data={data}
          isLoading={isLoading}
          displayCurrency={displayCurrency}
          setDisplayCurrency={setDisplayCurrency}
          onTimeRangeChange={onTimeRangeChange}
        />
      </TooltipProvider>
    </I18nextProvider>,
  )

describe('TVLVolumeChart', () => {
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

  it('calls onTimeRangeChange when a time range button is clicked', async () => {
    const onTimeRangeChange = jest.fn()
    renderComponent({ onTimeRangeChange })

    await userEvent.click(screen.getByText('1W'))

    expect(onTimeRangeChange).toHaveBeenCalledWith('1W')
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

  it('shows loader when isLoading is true', () => {
    renderComponent({ isLoading: true, data: [] })
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument()
  })
})
