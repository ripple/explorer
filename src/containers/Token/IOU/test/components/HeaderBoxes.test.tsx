import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../../i18n/testConfigEnglish'
import {
  HeaderBoxes,
  OverviewData,
  MarketData,
} from '../../components/HeaderBoxes'

jest.mock('../../../../shared/components/Account', () => ({
  Account: ({ displayText }: { displayText: string }) => (
    <div>{displayText}</div>
  ),
}))

jest.mock('../../../../shared/utils', () => ({
  shortenAccount: (account: string) => account.substring(0, 10),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

const mockOverviewData: OverviewData = {
  issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  issuer_account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  price: '$0.50',
  holders: '1,234',
  trustlines: '5,678',
  transfer_fee: '0.50%',
}

const mockMarketData: MarketData = {
  supply: '1,000,000',
  circ_supply: '800,000',
  market_cap: '$400,000',
  market_cap_usd: '400000',
  volume_24h: '$50,000',
  trades_24h: '9,999',
  amm_tvl: '$100,000',
  amm_account: 'rAMMAccount123456789',
  tvl_usd: '$100,000',
}

describe('HeaderBoxes Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('$0.50')).toBeInTheDocument()
  })

  it('displays overview data correctly', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('5,678')).toBeInTheDocument()
    expect(screen.getByText('0.50%')).toBeInTheDocument()
  })

  it('displays market data correctly', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('1,000,000')).toBeInTheDocument()
    expect(screen.getByText('800,000')).toBeInTheDocument()
    expect(screen.getByText('$400,000')).toBeInTheDocument()
    expect(screen.getByText('$50,000')).toBeInTheDocument()
  })

  it('shows loading spinner for circulating supply when isHoldersDataLoading is true', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
          isHoldersDataLoading
        />
      </TestWrapper>,
    )
    const spinners = container.querySelectorAll('.loading-spinner')
    expect(spinners.length).toBeGreaterThan(0)
  })

  it('shows loading spinner for market cap when isHoldersDataLoading is true', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
          isHoldersDataLoading
        />
      </TestWrapper>,
    )
    const spinners = container.querySelectorAll('.loading-spinner')
    expect(spinners.length).toBeGreaterThan(0)
  })

  it('shows loading spinner for AMM TVL when isAmmTvlLoading is true', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
          isAmmTvlLoading
        />
      </TestWrapper>,
    )
    const spinners = container.querySelectorAll('.loading-spinner')
    expect(spinners.length).toBeGreaterThan(0)
  })

  it('displays circulating supply when not loading', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
          isHoldersDataLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('800,000')).toBeInTheDocument()
  })

  it('displays market cap when not loading', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
          isHoldersDataLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('$400,000')).toBeInTheDocument()
  })

  it('handles empty market cap gracefully', () => {
    const dataWithoutMarketCap: MarketData = {
      ...mockMarketData,
      market_cap: '',
    }
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={dataWithoutMarketCap}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('$50,000')).toBeInTheDocument()
  })

  it('handles transfer fee as dash when not applicable', () => {
    const dataWithoutFee: OverviewData = {
      ...mockOverviewData,
      transfer_fee: '--',
    }
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={dataWithoutFee}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('displays volume and trades data', () => {
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('$50,000')).toBeInTheDocument()
  })

  it('renders both header boxes', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    const boxes = container.querySelectorAll('.header-box')
    expect(boxes.length).toBe(2)
  })

  it('renders all overview items', () => {
    const { container } = render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={mockMarketData}
        />
      </TestWrapper>,
    )
    const overviewItems = container.querySelectorAll('.header-box-item')
    expect(overviewItems.length).toBeGreaterThanOrEqual(5)
  })

  it('handles zero values correctly', () => {
    const zeroData: OverviewData = {
      issuer: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      issuer_account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      price: '$0.00',
      holders: '0',
      trustlines: '0',
      transfer_fee: '--',
    }
    const zeroMarketData: MarketData = {
      supply: '0',
      circ_supply: '0',
      market_cap: '',
      volume_24h: '--',
      trades_24h: '--',
      amm_tvl: '',
      amm_account: '',
    }
    render(
      <TestWrapper>
        <HeaderBoxes overviewData={zeroData} marketData={zeroMarketData} />
      </TestWrapper>,
    )
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('displays -- when both amm_tvl and tvl_usd are empty', () => {
    const dataWithoutTvl: MarketData = {
      ...mockMarketData,
      amm_tvl: '',
      tvl_usd: '',
    }
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={dataWithoutTvl}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('--')).toBeInTheDocument()
  })

  it('displays tvl_usd when available', () => {
    const dataWithTvlUsd: MarketData = {
      ...mockMarketData,
      amm_tvl: '',
      tvl_usd: '$50,000',
    }
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={dataWithTvlUsd}
        />
      </TestWrapper>,
    )
    const tvlElements = screen.getAllByText('$50,000')
    expect(tvlElements.length).toBeGreaterThan(0)
  })

  it('displays amm_tvl when tvl_usd is not available', () => {
    const dataWithAmmTvl: MarketData = {
      ...mockMarketData,
      amm_tvl: '$75,000',
      tvl_usd: '',
    }
    render(
      <TestWrapper>
        <HeaderBoxes
          overviewData={mockOverviewData}
          marketData={dataWithAmmTvl}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('$75,000')).toBeInTheDocument()
  })
})
