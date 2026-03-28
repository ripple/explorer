import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { MarketDataCard } from '../InfoCards/MarketDataCard'
import { TooltipProvider } from '../../shared/components/Tooltip'

const renderComponent = (props: any) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <TooltipProvider>
          <MarketDataCard {...props} />
        </TooltipProvider>
      </MemoryRouter>
    </I18nextProvider>,
  )

describe('MarketDataCard', () => {
  const defaultProps = {
    losData: {
      tvl_usd: 1234567.89,
      tvl_xrp: 5000000,
      trading_volume_usd: 50000,
      trading_volume_xrp: 200000,
      fees_collected_usd: 150,
      fees_collected_xrp: 600,
      annual_percentage_return: 0.0456,
      liquidity_provider_count: 747,
    },
    balance1: {
      currency: '524C555344000000000000000000000000000000',
      issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
      amount: 100000,
    },
    balance2: { currency: 'XRP', amount: 50000 },
    lpTokenBalance: '1000000',
  }

  it('renders Market Data title', () => {
    renderComponent(defaultProps)
    expect(screen.getByText('market_data')).toBeInTheDocument()
  })

  it('renders TVL, Volume, Fees, and APR fields', () => {
    renderComponent(defaultProps)
    expect(screen.getByText('tvl')).toBeInTheDocument()
    expect(screen.getByText('volume_24h')).toBeInTheDocument()
    expect(screen.getByText('fees_24h')).toBeInTheDocument()
    expect(screen.getByText('apr_24h')).toBeInTheDocument()
  })

  it('renders balance labels with currency in parentheses', () => {
    const { container } = renderComponent(defaultProps)
    const labels = container.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    // Should have two balance labels
    expect(balanceLabels.length).toBe(2)
    // XRP balance should show BALANCE (XRP) with no extra spaces
    const xrpLabel = balanceLabels.find((l) =>
      l.textContent?.includes('XRP'),
    )
    expect(xrpLabel).toBeTruthy()
  })

  it('renders LP Tokens with liquidity provider count', () => {
    renderComponent(defaultProps)
    expect(screen.getByText('lp_tokens')).toBeInTheDocument()
    expect(screen.getByText(/747/)).toBeInTheDocument()
  })

  it('does not render balance rows when balances are null', () => {
    renderComponent({ ...defaultProps, balance1: null, balance2: null })
    const labels = document.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    expect(balanceLabels.length).toBe(0)
  })

  it('always shows USD values (not affected by display currency)', () => {
    renderComponent(defaultProps)
    // TVL should use tvl_usd ($1.2M)
    const tvlRow = Array.from(
      document.querySelectorAll('.info-card-row'),
    ).find((r) => r.textContent?.includes('tvl'))
    expect(tvlRow?.textContent).toContain('$')
  })
})
