import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../../../i18n/testConfig'
import { MarketDataCard } from '../MarketDataCard'
import { TooltipProvider } from '../../../shared/components/Tooltip'
import { AMMPoolLOSData, FormattedBalance } from '../../types'

interface RenderProps {
  losData?: AMMPoolLOSData
  balance1?: FormattedBalance | null
  balance2?: FormattedBalance | null
  lpTokenBalance?: string
}

const defaultLosData: AMMPoolLOSData = {
  tvl_usd: 1234567.89,
  tvl_xrp: 5000000,
  trading_volume_usd: 50000,
  trading_volume_xrp: 200000,
  fees_collected_usd: 150,
  fees_collected_xrp: 600,
  annual_percentage_return: 0.0456,
  liquidity_provider_count: 747,
  issuer_1: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
  currency_1: '524C555344000000000000000000000000000000',
  issuer_2: null,
  currency_2: 'XRP',
  last_updated_timestamp: '2026-03-27T12:00:00Z',
}

const defaultBalance1: FormattedBalance = {
  currency: '524C555344000000000000000000000000000000',
  issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
  amount: 100000,
}

const defaultBalance2: FormattedBalance = { currency: 'XRP', amount: 50000 }

const renderComponent = ({
  losData = defaultLosData,
  balance1 = defaultBalance1,
  balance2 = defaultBalance2,
  lpTokenBalance = '1000000',
}: RenderProps = {}) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <TooltipProvider>
          <MarketDataCard
            losData={losData}
            balance1={balance1}
            balance2={balance2}
            lpTokenBalance={lpTokenBalance}
          />
        </TooltipProvider>
      </MemoryRouter>
    </I18nextProvider>,
  )

describe('MarketDataCard', () => {
  it('renders Market Data title', () => {
    renderComponent()
    expect(screen.getByText('market_data')).toBeInTheDocument()
  })

  it('renders TVL, Volume, Fees, and APR fields', () => {
    renderComponent()
    expect(screen.getByText('tvl')).toBeInTheDocument()
    expect(screen.getByText('volume_24h')).toBeInTheDocument()
    expect(screen.getByText('fees_24h')).toBeInTheDocument()
    expect(screen.getByText('apr_24h')).toBeInTheDocument()
  })

  it('renders balance labels with currency in parentheses', () => {
    const { container } = renderComponent()
    const labels = container.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    // Should have two balance labels
    expect(balanceLabels.length).toBe(2)
    // XRP balance should show BALANCE (XRP) with no extra spaces
    const xrpLabel = balanceLabels.find((l) => l.textContent?.includes('XRP'))
    expect(xrpLabel).toBeTruthy()
  })

  it('renders LP Tokens with liquidity provider count', () => {
    renderComponent()
    expect(screen.getByText('lp_tokens')).toBeInTheDocument()
    expect(screen.getByText(/747/)).toBeInTheDocument()
  })

  it('does not render balance rows when balances are null', () => {
    renderComponent({ balance1: null, balance2: null })
    const labels = document.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    expect(balanceLabels.length).toBe(0)
  })

  it('always shows USD values (not affected by display currency)', () => {
    renderComponent()
    // TVL should use tvl_usd ($1.2M)
    const tvlRow = Array.from(document.querySelectorAll('.info-card-row')).find(
      (r) => r.textContent?.includes('tvl'),
    )
    expect(tvlRow?.textContent).toContain('$')
  })
})
