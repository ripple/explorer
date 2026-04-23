import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import i18n from '../../../../i18n/testConfig'
import { MarketDataCard } from '../MarketDataCard'
import { TooltipProvider } from '../../../shared/components/Tooltip'
import { LOSAMMPoolData, FormattedBalance } from '../../types'

interface RenderProps {
  losData?: LOSAMMPoolData
  balance1?: FormattedBalance | null
  balance2?: FormattedBalance | null
  lpTokenBalance?: string
}

const defaultLosData: LOSAMMPoolData = {
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

  it('renders LOS fields with correct formatted values', () => {
    const { container } = renderComponent()
    const rows = container.querySelectorAll('.info-card-row')
    const getRowValue = (label: string) => {
      const row = Array.from(rows).find((r) =>
        r.querySelector('.info-card-label')?.textContent?.includes(label),
      )
      return row?.querySelector('.info-card-value')?.textContent
    }

    expect(screen.getByText('tvl')).toBeInTheDocument()
    expect(getRowValue('tvl')).toBe('$1.2M')

    expect(screen.getByText('volume_24h')).toBeInTheDocument()
    expect(getRowValue('volume_24h')).toBe('$50.0K')

    expect(screen.getByText('fees_24h')).toBeInTheDocument()
    expect(getRowValue('fees_24h')).toBe('$150.00')

    expect(screen.getByText('apr_24h')).toBeInTheDocument()
    expect(getRowValue('apr_24h')).toBe('0.046%')
  })

  it('renders balances with correct formatted values', () => {
    const { container } = renderComponent()
    const labels = container.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    expect(balanceLabels.length).toBe(2)

    const xrpLabel = balanceLabels.find((l) => l.textContent?.includes('XRP'))
    expect(xrpLabel).toBeTruthy()
    expect(
      xrpLabel?.closest('.info-card-row')?.querySelector('.info-card-value')
        ?.textContent,
    ).toBe('50.0K')

    const otherLabel = balanceLabels.find(
      (l) => !l.textContent?.includes('XRP'),
    )
    expect(otherLabel).toBeTruthy()
    expect(
      otherLabel?.closest('.info-card-row')?.querySelector('.info-card-value')
        ?.textContent,
    ).toBe('100.0K')
  })

  it('renders LP Tokens with formatted value and liquidity provider count', () => {
    const { container } = renderComponent()
    const rows = container.querySelectorAll('.info-card-row')
    const lpRow = Array.from(rows).find((r) =>
      r.querySelector('.info-card-label')?.textContent?.includes('lp_tokens'),
    )
    expect(lpRow).toBeTruthy()
    expect(lpRow?.querySelector('.info-card-value')?.textContent).toContain(
      '1.0M',
    )
    expect(lpRow?.querySelector('.info-card-subtitle')?.textContent).toContain(
      '747',
    )
  })

  it('does not render balance or LP rows when balances and LP are absent', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <TooltipProvider>
            <MarketDataCard
              losData={defaultLosData}
              balance1={null}
              balance2={null}
              lpTokenBalance={undefined}
            />
          </TooltipProvider>
        </MemoryRouter>
      </I18nextProvider>,
    )
    const labels = document.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    expect(balanceLabels.length).toBe(0)
    expect(screen.queryByText('lp_tokens')).not.toBeInTheDocument()
  })

  it('renders only balances and LP tokens when losData is undefined', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <TooltipProvider>
            <MarketDataCard
              balance1={defaultBalance1}
              balance2={defaultBalance2}
              lpTokenBalance="1000000"
            />
          </TooltipProvider>
        </MemoryRouter>
      </I18nextProvider>,
    )
    // LOS fields hidden
    expect(screen.queryByText('tvl')).not.toBeInTheDocument()
    expect(screen.queryByText('volume_24h')).not.toBeInTheDocument()
    expect(screen.queryByText('fees_24h')).not.toBeInTheDocument()
    expect(screen.queryByText('apr_24h')).not.toBeInTheDocument()
    expect(screen.queryByText(/liquidity_providers/)).not.toBeInTheDocument()
    // Balances still shown with correct values
    const labels = container.querySelectorAll('.info-card-label')
    const balanceLabels = Array.from(labels).filter((l) =>
      l.textContent?.includes('BALANCE'),
    )
    expect(balanceLabels.length).toBe(2)
    expect(screen.getByText('100.0K')).toBeInTheDocument()
    expect(screen.getByText('50.0K')).toBeInTheDocument()
    // LP tokens still shown
    expect(screen.getByText('lp_tokens')).toBeInTheDocument()
    expect(screen.getByText('1.0M')).toBeInTheDocument()
  })
})
