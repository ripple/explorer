import { render, screen, fireEvent } from '@testing-library/react'
import { AMMRankingsTable } from '../AMMRankingsTable'
import { AMMPool } from '../api'
import i18n from '../../../i18n/testConfigEnglish'
import { QuickHarness } from '../../test/utils'

// Mock SVG imports
jest.mock('../../shared/images/hover.svg', () => 'svg')
jest.mock('../../shared/images/xrp_icon.svg?url', () => 'xrp_icon.svg')
jest.mock('../../shared/images/default_token_icon.svg', () => 'svg')

const createAMM = (overrides: Partial<AMMPool> = {}): AMMPool => ({
  amm_account_id: 'rDefaultAMMAccountId1234567890',
  currency_1: 'XRP',
  currency_2: 'USD',
  issuer_2: 'rIssuer123',
  tvl_xrp: 100000,
  tvl_usd: 50000,
  trading_volume_xrp: 20000,
  trading_volume_usd: 10000,
  fees_collected_xrp: 200,
  fees_collected_usd: 100,
  annual_percentage_return: 0.12345,
  liquidity_provider_count: 42,
  amm_created_timestamp: '2025-01-01T00:00:00Z',
  trading_fee: 500,
  ...overrides,
})

const renderComponent = (
  amms: AMMPool[] = [],
  currencyMode: 'usd' | 'xrp' = 'usd',
) =>
  render(
    <QuickHarness i18n={i18n}>
      <AMMRankingsTable amms={amms} currencyMode={currencyMode} />
    </QuickHarness>,
  )

describe('AMMRankingsTable', () => {
  it('renders table headers', () => {
    renderComponent()
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Asset Pair')).toBeInTheDocument()
    expect(screen.getByText('AMM Account ID')).toBeInTheDocument()
    expect(screen.getByText('TVL')).toBeInTheDocument()
    expect(screen.getByText('# of LPs')).toBeInTheDocument()
    expect(screen.getByText('Fees (24H)')).toBeInTheDocument()
    expect(screen.getByText('Trading Fee')).toBeInTheDocument()
    expect(screen.getByText('APR (24H)')).toBeInTheDocument()
  })

  it('renders category filter buttons', () => {
    renderComponent()
    expect(screen.getByText('RWA')).toBeInTheDocument()
    expect(screen.getByText('Stablecoins')).toBeInTheDocument()
    expect(screen.getByText('Memes')).toBeInTheDocument()
    expect(screen.getByText('DeFi')).toBeInTheDocument()
  })

  it('renders AMM row with USD values', () => {
    const amm = createAMM()
    const { container } = renderComponent([amm])
    // Rank
    expect(container.querySelector('td.rank')).toHaveTextContent('1')
    // TVL in USD
    expect(container.querySelector('td.tvl')).toBeInTheDocument()
    // LP count
    expect(container.querySelector('td.lp-count')).toHaveTextContent('42')
    // Trading fee: 500/1000 = 0.5
    expect(container.querySelector('td.trading-fee')).toHaveTextContent('0.5')
  })

  it('renders trading fee correctly for different values', () => {
    const amms = [
      createAMM({ amm_account_id: 'rAMM1', trading_fee: 1000 }),
      createAMM({ amm_account_id: 'rAMM2', trading_fee: 100 }),
      createAMM({ amm_account_id: 'rAMM3', trading_fee: 1 }),
    ]
    const { container } = renderComponent(amms)
    const tradingFeeCells = container.querySelectorAll('td.trading-fee')
    // 1000/1000 = 1
    expect(tradingFeeCells[0]).toHaveTextContent('1')
    // 100/1000 = 0.1
    expect(tradingFeeCells[1]).toHaveTextContent('0.1')
    // 1/1000 = 0.001
    expect(tradingFeeCells[2]).toHaveTextContent('0.001')
  })

  it('renders -- when trading_fee is undefined', () => {
    const amm = createAMM({ trading_fee: undefined })
    const { container } = renderComponent([amm])
    expect(container.querySelector('td.trading-fee')).toHaveTextContent('--')
  })

  it('renders -- for null numeric fields', () => {
    const amm = createAMM({
      tvl_usd: null as any,
      trading_volume_usd: null as any,
      fees_collected_usd: null as any,
      annual_percentage_return: null as any,
      liquidity_provider_count: null as any,
      trading_fee: undefined,
    })
    const { container } = renderComponent([amm])
    expect(container.querySelector('td.tvl')).toHaveTextContent('--')
    expect(container.querySelector('td.volume')).toHaveTextContent('--')
    expect(container.querySelector('td.fees-24h')).toHaveTextContent('--')
    expect(container.querySelector('td.trading-fee')).toHaveTextContent('--')
    expect(container.querySelector('td.apr')).toHaveTextContent('--')
    expect(container.querySelector('td.lp-count')).toHaveTextContent('--')
  })

  it('switches currency to XRP and displays XRP values', () => {
    const amm = createAMM()
    const { container } = renderComponent([amm], 'usd')

    // Toggle to XRP
    const toggle = container.querySelector(
      '.toggle-switch input',
    ) as HTMLInputElement
    fireEvent.click(toggle)

    // After toggle, values should contain "XRP"
    expect(container.querySelector('td.tvl')?.textContent).toContain('XRP')
  })

  it('filters AMMs by category', () => {
    const amms = [
      createAMM({
        amm_account_id: 'rRWA1',
        asset_class_1: 'rwa',
        currency_1: 'RLUSD',
      }),
      createAMM({
        amm_account_id: 'rDEFI1',
        asset_class_1: 'defi',
        currency_1: 'DFI',
      }),
    ]
    const { container } = renderComponent(amms)

    // Both rows visible initially
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2)

    // Click RWA filter
    fireEvent.click(screen.getByText('RWA'))
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1)

    // Click RWA again to deselect
    fireEvent.click(screen.getByText('RWA'))
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
  })

  it('searches AMMs by currency name', () => {
    const amms = [
      createAMM({
        amm_account_id: 'rAMM1',
        currency_1: 'XRP',
        currency_2: 'USD',
      }),
      createAMM({
        amm_account_id: 'rAMM2',
        currency_1: 'BTC',
        currency_2: 'ETH',
      }),
    ]
    const { container } = renderComponent(amms)

    const searchInput = container.querySelector(
      '.amm-search',
    ) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'BTC' } })

    expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  })

  it('searches AMMs by account ID', () => {
    const amms = [
      createAMM({ amm_account_id: 'rUniqueAccount111111111111111' }),
      createAMM({ amm_account_id: 'rOtherAccount2222222222222222' }),
    ]
    const { container } = renderComponent(amms)

    const searchInput = container.querySelector(
      '.amm-search',
    ) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'rUniqueAccount' } })

    expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
  })

  it('paginates results (15 per page)', () => {
    // Create 20 AMMs
    const amms = Array.from({ length: 20 }, (_, i) =>
      createAMM({ amm_account_id: `rAMM${String(i).padStart(30, '0')}` }),
    )
    const { container } = renderComponent(amms)

    // Page 1: 15 rows
    expect(container.querySelectorAll('tbody tr')).toHaveLength(15)

    // First row rank should be 1
    const firstRank = container.querySelector('tbody tr td.rank')
    expect(firstRank).toHaveTextContent('1')
  })

  it('renders with XRP currency mode by default when passed', () => {
    const amm = createAMM()
    const { container } = renderComponent([amm], 'xrp')

    // Values should contain "XRP"
    expect(container.querySelector('td.tvl')?.textContent).toContain('XRP')
  })

  it('renders empty table when no AMMs provided', () => {
    const { container } = renderComponent([])
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0)
  })
})
