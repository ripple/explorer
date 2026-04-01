import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import Balances from '../Balances'

// Mock SVG imports
jest.mock('../../../shared/images/usd_icon.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="usd-icon" />,
}))

jest.mock('../../../shared/images/xrp_balance_icon.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="xrp-icon" />,
}))

jest.mock('../../../shared/images/xrp_reserve_balance_icon.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="reserve-icon" />,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('Balances Component', () => {
  describe('Rendering', () => {
    it('renders all three balance cards with icons', () => {
      const account = {
        info: {
          balance: 1000000000, // 1000 XRP (in drops)
          reserve: 10000000, // 10 XRP
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // Verify three balance cards exist
      const balanceCards = container.querySelectorAll('.balance-card')
      expect(balanceCards.length).toBe(3)

      // Verify XRP balance card and icon
      expect(screen.getByText('XRP Balance')).toBeInTheDocument()
      expect(screen.getByTestId('xrp-icon')).toBeInTheDocument()

      // Verify USD balance card and icon
      expect(screen.getByText('XRP Balance (USD)')).toBeInTheDocument()
      expect(screen.getByTestId('usd-icon')).toBeInTheDocument()

      // Verify Reserve balance card and icon
      expect(screen.getByText('Reserve Balance')).toBeInTheDocument()
      expect(screen.getByTestId('reserve-icon')).toBeInTheDocument()
    })
  })

  describe('Balance Calculations', () => {
    it('converts drops to XRP correctly (1000 XRP)', () => {
      const account = {
        info: {
          balance: 1000000000, // 1000 XRP in drops
          reserve: 0,
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // XRP balance should show 1000
      const xrpCard = container.querySelector('.balance-card.xrp')
      expect(xrpCard?.textContent).toContain('1,000')
    })

    it('calculates USD value correctly', () => {
      const account = {
        info: {
          balance: 2000000000, // 2000 XRP
          reserve: 0,
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // USD should be 2000 * 0.5 = 1000
      const usdCard = container.querySelector('.balance-card.usd')
      expect(usdCard?.textContent).toContain('$1,000')
    })

    it('handles zero balance', () => {
      const account = {
        info: {
          balance: 0,
          reserve: 0,
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const xrpCard = container.querySelector('.balance-card.xrp')
      expect(xrpCard?.textContent).toContain('0')
    })

    it('handles missing balance (defaults to 0)', () => {
      const account = {
        info: {},
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const xrpCard = container.querySelector('.balance-card.xrp')
      expect(xrpCard?.textContent).toContain('0')
    })

    it('displays reserve balance', () => {
      const account = {
        info: {
          balance: 1000000000,
          reserve: 20, // 20 XRP (already in XRP, not drops)
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const reserveCard = container.querySelector('.balance-card.reserve')
      expect(reserveCard?.textContent).toContain('20')
    })
  })

  describe('XRP to USD Rate', () => {
    it('updates USD value when rate changes', () => {
      const account = {
        info: {
          balance: 1000000000, // 1000 XRP
          reserve: 0,
        },
      }

      const { container, rerender } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // Initial: 1000 XRP * $0.5 = $500
      let usdCard = container.querySelector('.balance-card.usd')
      expect(usdCard?.textContent).toContain('$500')

      // Update rate: 1000 XRP * $2 = $2000
      rerender(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={2} />
        </TestWrapper>,
      )

      usdCard = container.querySelector('.balance-card.usd')
      expect(usdCard?.textContent).toContain('2,000')
    })

    it('handles zero USD rate', () => {
      const account = {
        info: {
          balance: 1000000000,
          reserve: 0,
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0} />
        </TestWrapper>,
      )

      const usdCard = container.querySelector('.balance-card.usd')
      expect(usdCard?.textContent).toContain('$0')
    })
  })

  describe('Number Formatting', () => {
    it('formats all three balances with proper formatting', () => {
      const account = {
        info: {
          balance: 5545000, // 5.545 XRP
          reserve: 20.538, // 20.54 XRP
        },
      }

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // XRP balance with decimal
      const xrpCard = container.querySelector('.balance-card.xrp')
      expect(xrpCard?.textContent).toContain('5.55')

      // USD balance calculated and formatted
      const usdCard = container.querySelector('.balance-card.usd')
      expect(usdCard?.textContent).toContain('$2.77') // 5.545 * 0.5 = 2.7725

      // Reserve balance with decimal
      const reserveCard = container.querySelector('.balance-card.reserve')
      expect(reserveCard?.textContent).toContain('20.54')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing info property', () => {
      const account = {}

      const { container } = render(
        <TestWrapper>
          <Balances account={account} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const xrpCard = container.querySelector('.balance-card.xrp')
      expect(xrpCard).toBeInTheDocument()
    })
  })
})
