import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import AccountHeader from '../index'

// Mock the DomainLink component
jest.mock('../../../shared/components/DomainLink', () => ({
  __esModule: true,
  default: ({ domain }: { domain: string }) => (
    <a href={`http://${domain}`} data-testid="domain-link">
      {domain}
    </a>
  ),
}))

// Mock the Account component
jest.mock('../../../shared/components/Account', () => ({
  Account: ({ account }: { account: string }) => (
    <span data-testid="classic-address">{account}</span>
  ),
}))

// Mock the SVG import
jest.mock('../../../shared/images/info-duotone.svg', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <svg data-testid="info-icon" className={className} />
  ),
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

describe('AccountHeader', () => {
  const mockAccountId = 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'

  describe('Basic rendering', () => {
    it('renders regular account address', () => {
      render(
        <TestWrapper>
          <AccountHeader isAccountDeleted={false} accountId={mockAccountId} />
        </TestWrapper>,
      )

      expect(screen.getByText('Address')).toBeInTheDocument()
      expect(screen.getByText(mockAccountId)).toBeInTheDocument()
      // No deleted banner
      expect(screen.queryByTestId('info-icon')).not.toBeInTheDocument()
      expect(screen.queryByText('Account Deleted')).not.toBeInTheDocument()
    })
  })

  describe('Deleted account banner', () => {
    it('shows deleted banner when account is deleted', () => {
      render(
        <TestWrapper>
          <AccountHeader isAccountDeleted accountId={mockAccountId} />
        </TestWrapper>,
      )

      expect(screen.getByTestId('info-icon')).toBeInTheDocument()
      expect(screen.getByText('Account Deleted')).toBeInTheDocument()
      expect(
        screen.getByText(
          'This account has been deleted from the XRP Ledger. Historical data is shown for reference only.',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('X-Address support', () => {
    it('renders extended address label when xAddress is provided', () => {
      const mockAccount = {
        xAddress: {
          classicAddress: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
          tag: 12345,
        },
      }

      render(
        <TestWrapper>
          <AccountHeader
            isAccountDeleted={false}
            accountId="X7AcgcsBL6XDcUb289X4mJ8djcdyKaB5hJDWMArnXr61cqZ"
            account={mockAccount}
          />
        </TestWrapper>,
      )

      expect(
        screen.getByText('Extended Address (X-Address)'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('X7AcgcsBL6XDcUb289X4mJ8djcdyKaB5hJDWMArnXr61cqZ'),
      ).toBeInTheDocument()

      // Classic address and tag should also be shown
      expect(screen.getByText('Classic Address:')).toBeInTheDocument()
      expect(screen.getByTestId('classic-address')).toBeInTheDocument()
      expect(
        screen.getByText('rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'),
      ).toBeInTheDocument()

      expect(screen.getByText('Tag:')).toBeInTheDocument()
      expect(screen.getByText('12345')).toBeInTheDocument()
    })

    it('does not render classic address when xAddress classicAddress is missing', () => {
      const mockAccount = {
        xAddress: {
          tag: 12345,
        },
      }

      render(
        <TestWrapper>
          <AccountHeader
            isAccountDeleted={false}
            accountId="X7AcgcsBL6XDcUb289X4mJ8djcdyKaB5hJDWMArnXr61cqZ"
            account={mockAccount}
          />
        </TestWrapper>,
      )

      expect(screen.queryByText('Classic Address:')).not.toBeInTheDocument()
    })

    it('does not render address tag when xAddress tag is missing', () => {
      const mockAccount = {
        xAddress: {
          classicAddress: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
        },
      }

      render(
        <TestWrapper>
          <AccountHeader
            isAccountDeleted={false}
            accountId="X7AcgcsBL6XDcUb289X4mJ8djcdyKaB5hJDWMArnXr61cqZ"
            account={mockAccount}
          />
        </TestWrapper>,
      )

      expect(screen.queryByText('Tag:')).not.toBeInTheDocument()
    })
  })

  describe('Domain display', () => {
    it('renders domain when account info has domain', () => {
      const mockAccount = {
        info: {
          domain: 'ripple.com',
        },
      }

      render(
        <TestWrapper>
          <AccountHeader
            isAccountDeleted={false}
            accountId={mockAccountId}
            account={mockAccount}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('Domain:')).toBeInTheDocument()
      expect(screen.getByTestId('domain-link')).toBeInTheDocument()
      expect(screen.getByText('ripple.com')).toBeInTheDocument()
    })

    it('does not render domain when account info is missing', () => {
      render(
        <TestWrapper>
          <AccountHeader isAccountDeleted={false} accountId={mockAccountId} />
        </TestWrapper>,
      )

      expect(screen.queryByText('Domain:')).not.toBeInTheDocument()
      expect(screen.queryByTestId('domain-link')).not.toBeInTheDocument()
    })

    it('does not render domain when domain field is missing', () => {
      const mockAccount = {
        info: {},
      }

      render(
        <TestWrapper>
          <AccountHeader
            isAccountDeleted={false}
            accountId={mockAccountId}
            account={mockAccount}
          />
        </TestWrapper>,
      )

      expect(screen.queryByText('Domain:')).not.toBeInTheDocument()
      expect(screen.queryByTestId('domain-link')).not.toBeInTheDocument()
    })

    it('renders with all optional fields missing', () => {
      render(
        <TestWrapper>
          <AccountHeader isAccountDeleted={false} accountId={mockAccountId} />
        </TestWrapper>,
      )

      // Only address should be shown
      expect(screen.getByText('Address')).toBeInTheDocument()
      expect(screen.getByText(mockAccountId)).toBeInTheDocument()

      // No optional fields
      expect(screen.queryByText(/Classic Address/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Tag/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Domain/)).not.toBeInTheDocument()
      expect(screen.queryByText('Account Deleted')).not.toBeInTheDocument()
    })
  })

  describe('Address title attribute', () => {
    it('sets title attribute on address value for tooltip', () => {
      render(
        <TestWrapper>
          <AccountHeader isAccountDeleted={false} accountId={mockAccountId} />
        </TestWrapper>,
      )

      const addressValue = screen.getByTitle(mockAccountId)
      expect(addressValue).toBeInTheDocument()
      expect(addressValue).toHaveTextContent(mockAccountId)
    })
  })
})
