import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import { TokenHeader } from '../TokenHeader/index'
import { LOSToken } from '../../shared/losTypes'
import { TokenHoldersData } from '../api/holders'

jest.mock('../../shared/components/Currency', () => ({
  __esModule: true,
  default: ({ currency }: { currency: string }) => <div>{currency}</div>,
}))

jest.mock('../components/HeaderBoxes', () => ({
  HeaderBoxes: () => <div>HeaderBoxes</div>,
}))

jest.mock('../../shared/components/Account', () => ({
  Account: ({ displayText }: { displayText: string }) => (
    <div>{displayText}</div>
  ),
}))

jest.mock('../../shared/utils', () => ({
  shortenAccount: (account: string) => account.substring(0, 10),
  localizeNumber: (num: number) => num.toString(),
  formatLargeNumber: (d: number, digits: number = 1) => {
    if (d >= 1000000) return { num: (d / 1000000).toFixed(digits), unit: 'M' }
    if (d >= 1000) return { num: (d / 1000).toFixed(digits), unit: 'K' }
    return { num: d.toString(), unit: '' }
  },
  formatSmallNumber: (value: number) => value.toFixed(4),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

const mockTokenData: LOSToken = {
  issuer_account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  issuer_name: 'Test Issuer',
  issuer_domain: 'https://example.com',
  icon: 'https://example.com/icon.png',
  price: '0.50',
  holders: 1000,
  trustlines: 5000,
  transfer_fee: 0.5,
  supply: '1000000',
  circ_supply: '800000',
  daily_volume: '50000',
  daily_trades: 1234,
  market_cap_usd: 400000,
  tvl_usd: 100000,
  asset_subclass: 'stablecoin',
}

const mockHoldersData: TokenHoldersData = {
  holders: [
    {
      account: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      balance: 250000,
      percent: 25,
    },
    {
      account: 'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w',
      balance: 150000,
      percent: 15,
    },
  ],
  totalSupply: 1000000,
}

describe('TokenHeader Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('displays token currency', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="EUR"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('EUR')).toBeInTheDocument()
  })

  it('displays issuer name when available', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('TEST ISSUER')).toBeInTheDocument()
  })

  it('displays issuer domain link when available', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('renders HeaderBoxes component', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('HeaderBoxes')).toBeInTheDocument()
  })

  it('displays token logo when available', () => {
    const { container } = render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    const logo = container.querySelector('img.token-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'https://example.com/icon.png')
  })

  it('displays placeholder when token logo is not available', () => {
    const tokenDataWithoutIcon = { ...mockTokenData, icon: '' }
    const { container } = render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataWithoutIcon}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    const placeholder = container.querySelector('.token-logo.no-logo')
    expect(placeholder).toBeInTheDocument()
  })

  it('handles issuer domain without protocol', () => {
    const tokenDataWithoutProtocol = {
      ...mockTokenData,
      issuer_domain: 'example.com',
    }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataWithoutProtocol}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    const link = screen.getByText('example.com').closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('handles issuer domain with protocol', () => {
    const tokenDataWithProtocol = {
      ...mockTokenData,
      issuer_domain: 'https://example.com',
    }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataWithProtocol}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    const link = screen.getByText('example.com').closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('passes holders data to HeaderBoxes', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          holdersData={mockHoldersData}
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('HeaderBoxes')).toBeInTheDocument()
  })

  it('passes AMM TVL data to HeaderBoxes', () => {
    const ammTvlData = { tvl: 100000, account: 'rAMMAccount123456789' }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          ammTvlData={ammTvlData}
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('HeaderBoxes')).toBeInTheDocument()
  })

  it('passes loading states to HeaderBoxes', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading
          isAmmTvlLoading
        />
      </TestWrapper>,
    )
    expect(screen.getByText('HeaderBoxes')).toBeInTheDocument()
  })

  it('handles zero XRP USD rate', () => {
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="0"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('handles non-stablecoin asset subclass', () => {
    const tokenDataNonStablecoin = {
      ...mockTokenData,
      asset_subclass: 'utility',
    }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataNonStablecoin}
          xrpUSDRate="2.50"
          holdersData={mockHoldersData}
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
  })

  it('renders token label and category pill', () => {
    const { container } = render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={mockTokenData}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(container.querySelector('.token-indicator')).toBeInTheDocument()
    expect(container.querySelector('.category-pill')).toBeInTheDocument()
  })

  it('handles issuer name with special characters', () => {
    const tokenDataWithSpecialChars = {
      ...mockTokenData,
      issuer_name: '(Test) Issuer (Name)',
    }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataWithSpecialChars}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('TEST ISSUER NAME')).toBeInTheDocument()
  })

  it('handles missing issuer name', () => {
    const tokenDataWithoutIssuerName = {
      ...mockTokenData,
      issuer_name: '',
    }
    render(
      <TestWrapper>
        <TokenHeader
          currency="USD"
          tokenData={tokenDataWithoutIssuerName}
          xrpUSDRate="2.50"
          isHoldersDataLoading={false}
          isAmmTvlLoading={false}
        />
      </TestWrapper>,
    )
    expect(screen.getByText('USD')).toBeInTheDocument()
  })
})
