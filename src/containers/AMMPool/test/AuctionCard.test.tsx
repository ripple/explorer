import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { AuctionCard } from '../InfoCards/AuctionCard'

jest.mock('../../shared/images/auction_icon.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="auction-icon" />,
}))

const renderComponent = (props: any) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AuctionCard {...props} />
      </MemoryRouter>
    </I18nextProvider>,
  )

describe('AuctionCard', () => {
  const defaultProps = {
    auctionSlot: {
      account: 'rsWRnby4f9QzarQQs3MpRhBncUgKUC56Ff',
      expiration: '2026-03-28T14:30:00+0000',
      discounted_fee: 86,
      price: {
        value: '100.5',
        currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
        issuer: 'rJbt6ryq1TzikBuvVQDaxVLqL77eJeibsj',
      },
      time_interval: 5,
    },
    tvlUsd: 1000000,
    lpTokenBalance: '5000000',
    tradingFee: 500,
  }

  it('renders Auction title', () => {
    renderComponent(defaultProps)
    expect(screen.getByText('auction')).toBeInTheDocument()
  })

  it('renders all field labels', () => {
    renderComponent(defaultProps)
    expect(screen.getByText('current_holder')).toBeInTheDocument()
    expect(screen.getByText('expiration')).toBeInTheDocument()
    expect(screen.getByText('discounted_fee')).toBeInTheDocument()
    expect(screen.getByText('price_paid')).toBeInTheDocument()
    expect(screen.getByText('replacement_cost')).toBeInTheDocument()
  })

  it('renders discounted fee without truncation', () => {
    renderComponent(defaultProps)
    // 86 / 1000 = 0.086, should show 0.086%
    expect(screen.getByText('0.086%')).toBeInTheDocument()
  })

  it('shows -- for all fields when auctionSlot is undefined', () => {
    renderComponent({
      tvlUsd: undefined,
      lpTokenBalance: undefined,
      tradingFee: 500,
    })
    const values = document.querySelectorAll('.info-card-value')
    const dashValues = Array.from(values).filter(
      (v) => v.textContent === '--',
    )
    expect(dashValues.length).toBe(5)
  })

  it('shows -- for expiration when not provided', () => {
    renderComponent({
      auctionSlot: { account: 'rTest' },
      tvlUsd: undefined,
      lpTokenBalance: undefined,
      tradingFee: 500,
    })
    const rows = document.querySelectorAll('.info-card-row')
    const expirationRow = Array.from(rows).find((r) =>
      r.textContent?.includes('expiration'),
    )
    expect(expirationRow).toHaveTextContent('--')
  })

  it('renders Price Paid with LP token amount', () => {
    renderComponent(defaultProps)
    expect(screen.getByText(/100.5/)).toBeInTheDocument()
  })

  describe('Replacement Cost calculation', () => {
    it('uses minimum bid formula for expired slot (time_interval=20)', () => {
      renderComponent({
        ...defaultProps,
        auctionSlot: { ...defaultProps.auctionSlot, time_interval: 20 },
      })
      // M = TotalLP * (TradingFee/100000) / 25
      // M = 5000000 * 0.005 / 25 = 1000
      expect(screen.getByText(/1,000/)).toBeInTheDocument()
    })

    it('uses minimum bid for last interval (time_interval=19)', () => {
      renderComponent({
        ...defaultProps,
        auctionSlot: { ...defaultProps.auctionSlot, time_interval: 19 },
      })
      // Same as expired: M = 1000
      expect(screen.getByText(/1,000/)).toBeInTheDocument()
    })

    it('uses first interval formula (time_interval=0)', () => {
      renderComponent({
        ...defaultProps,
        auctionSlot: { ...defaultProps.auctionSlot, time_interval: 0 },
      })
      // P = B * 1.05 + M = 100.5 * 1.05 + 1000 = 1105.525
      expect(screen.getByText(/1,105/)).toBeInTheDocument()
    })

    it('uses decay formula for middle intervals', () => {
      renderComponent({
        ...defaultProps,
        auctionSlot: { ...defaultProps.auctionSlot, time_interval: 10 },
      })
      // t = 10/20 = 0.5, t^60 ≈ 0 (very small)
      // P = B * 1.05 * (1 - 0.5^60) + M ≈ 100.5 * 1.05 + 1000 ≈ 1105.525
      // (0.5^60 is essentially 0)
      expect(screen.getByText(/1,105/)).toBeInTheDocument()
    })
  })
})
