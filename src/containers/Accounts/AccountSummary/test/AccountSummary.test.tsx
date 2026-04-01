import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import { AccountSummary } from '../index'

// Mock the child components and SVG imports
jest.mock('../Balances', () => ({
  __esModule: true,
  default: ({ account, xrpToUSDRate }: any) => (
    <div data-testid="balances-mock">
      Balance: {account.info?.balance} Rate: {xrpToUSDRate}
    </div>
  ),
}))

jest.mock('../DetailsCard', () => ({
  __esModule: true,
  default: ({ account, lang }: any) => (
    <div data-testid="details-card-mock">
      Sequence: {account.info?.sequence} Lang: {lang}
    </div>
  ),
}))

jest.mock('../FlagsCard', () => ({
  __esModule: true,
  default: ({ account }: any) => (
    <div data-testid="flags-card-mock">
      Flags: {account.info?.flags?.length || 0}
    </div>
  ),
}))

jest.mock('../SignersCard', () => ({
  __esModule: true,
  default: ({ signers }: any) => (
    <div data-testid="signers-card-mock">Signers: {signers.length}</div>
  ),
}))

jest.mock('../../../shared/images/down_arrow.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="arrow-icon" />,
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('AccountSummary Component', () => {
  const mockAccount = {
    info: {
      balance: 1000000000,
      sequence: 123,
      flags: ['lsfGlobalFreeze'],
    },
  }

  describe('Rendering and Toggle Behavior', () => {
    it('renders balances and collapsed properties by default, then expands/collapses on toggle', () => {
      render(
        <TestWrapper>
          <AccountSummary account={mockAccount} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // Renders balances and properties header
      expect(screen.getByTestId('balances-mock')).toBeInTheDocument()
      expect(screen.getByText('Account Properties')).toBeInTheDocument()

      // Properties are collapsed by default
      const toggleButton = screen.getByLabelText('Toggle account properties')
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByTestId('flags-card-mock')).not.toBeInTheDocument()
      expect(screen.queryByTestId('details-card-mock')).not.toBeInTheDocument()

      // Expand properties
      fireEvent.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByTestId('flags-card-mock')).toBeInTheDocument()
      expect(screen.getByTestId('details-card-mock')).toBeInTheDocument()

      // Collapse again
      fireEvent.click(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByTestId('flags-card-mock')).not.toBeInTheDocument()
    })
  })

  describe('Props and Content', () => {
    it('passes correct props to child components', () => {
      render(
        <TestWrapper>
          <AccountSummary account={mockAccount} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      // Balances receives account and rate
      expect(screen.getByText(/Balance: 1000000000/)).toBeInTheDocument()
      expect(screen.getByText(/Rate: 0.5/)).toBeInTheDocument()

      // FlagsCard receives account
      const toggleButton = screen.getByLabelText('Toggle account properties')
      fireEvent.click(toggleButton)
      expect(screen.getByText('Flags: 1')).toBeInTheDocument()
    })

    it('renders SignersCard when signers exist, hides when none', () => {
      // Without signers
      render(
        <TestWrapper>
          <AccountSummary account={mockAccount} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const toggleButton = screen.getByLabelText('Toggle account properties')
      fireEvent.click(toggleButton)
      expect(screen.queryByTestId('signers-card-mock')).not.toBeInTheDocument()
    })

    it('renders SignersCard when account has signers', () => {
      const accountWithSigners = {
        ...mockAccount,
        signerList: {
          signers: [
            { account: 'rSigner1', weight: 1 },
            { account: 'rSigner2', weight: 2 },
          ],
        },
      }

      render(
        <TestWrapper>
          <AccountSummary account={accountWithSigners} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      const toggleButton = screen.getByLabelText('Toggle account properties')
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('signers-card-mock')).toBeInTheDocument()
      expect(screen.getByText('Signers: 2')).toBeInTheDocument()
    })

    it('handles empty account gracefully', () => {
      render(
        <TestWrapper>
          <AccountSummary account={{}} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      expect(screen.getByTestId('balances-mock')).toBeInTheDocument()

      const toggleButton = screen.getByLabelText('Toggle account properties')
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('flags-card-mock')).toBeInTheDocument()
      expect(screen.getByTestId('details-card-mock')).toBeInTheDocument()
    })

    it('handles undefined account with default value', () => {
      render(
        <TestWrapper>
          <AccountSummary account={undefined} xrpToUSDRate={0.5} />
        </TestWrapper>,
      )

      expect(screen.getByTestId('balances-mock')).toBeInTheDocument()

      const toggleButton = screen.getByLabelText('Toggle account properties')
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('flags-card-mock')).toBeInTheDocument()
      expect(screen.getByTestId('details-card-mock')).toBeInTheDocument()
    })
  })
})
