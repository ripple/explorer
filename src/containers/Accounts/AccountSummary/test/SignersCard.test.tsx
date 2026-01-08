import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import SignersCard from '../SignersCard'

// Mock the Account component
jest.mock('../../../shared/components/Account', () => ({
  Account: ({ account, displayText }: any) => (
    <span data-testid={`account-${account}`}>{displayText || account}</span>
  ),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

describe('SignersCard Component', () => {
  describe('Rendering', () => {
    it('renders the card with header', () => {
      const signers = [{ account: 'rSigner1', weight: 1 }]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByText('Signers')).toBeInTheDocument()
      expect(container.querySelector('.card-header')).toBeInTheDocument()
      expect(container.querySelector('.header-title')).toBeInTheDocument()
    })

    it('renders a single signer', () => {
      const signers = [{ account: 'rSigner', weight: 1 }]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByTestId('account-rSigner')).toBeInTheDocument()
      const signerItems = container.querySelectorAll('.signer-item')
      expect(signerItems.length).toBe(1)
    })

    it('renders multiple signers', () => {
      const signers = [
        { account: 'rSigner1', weight: 1 },
        { account: 'rSigner2', weight: 2 },
        { account: 'rSigner3', weight: 3 },
      ]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByTestId('account-rSigner1')).toBeInTheDocument()
      expect(screen.getByTestId('account-rSigner2')).toBeInTheDocument()
      expect(screen.getByTestId('account-rSigner3')).toBeInTheDocument()
      const signerItems = container.querySelectorAll('.signer-item')
      expect(signerItems.length).toBe(3)
    })
  })

  describe('Signer Weight', () => {
    it('displays signer weight when present', () => {
      const signers = [{ account: 'rSigner1', weight: 5 }]

      render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByText(/Weight/i)).toBeInTheDocument()
      expect(screen.getByText(/5/)).toBeInTheDocument()
    })

    it('displays different weights for different signers', () => {
      const signers = [
        { account: 'rSigner1', weight: 1 },
        { account: 'rSigner2', weight: 3 },
        { account: 'rSigner3', weight: 5 },
      ]

      render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByText(/Weight.*1/)).toBeInTheDocument()
      expect(screen.getByText(/Weight.*3/)).toBeInTheDocument()
      expect(screen.getByText(/Weight.*5/)).toBeInTheDocument()
    })

    it('does not display weight when undefined', () => {
      const signers = [{ account: 'rSigner1' }]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(container.querySelector('.signer-weight')).not.toBeInTheDocument()
    })

    it('displays weight of zero', () => {
      const signers = [{ account: 'rSigner1', weight: 0 }]

      render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByText(/Weight.*0/)).toBeInTheDocument()
    })
  })

  describe('Account Display', () => {
    it('uses shortened account address for display', () => {
      const longAccount = 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
      const signers = [{ account: longAccount, weight: 1 }]

      render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      // Should show shortened version: 7 chars...5 chars
      expect(screen.getByText(/rN7n7ot.*6fzRH/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty signers array', () => {
      const signers: any[] = []

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      const signerItems = container.querySelectorAll('.signer-item')
      expect(signerItems.length).toBe(0)
    })

    it('uses index as key when account is missing', () => {
      const signers = [{ weight: 1 } as any, { weight: 2 } as any]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      const signerItems = container.querySelectorAll('.signer-item')
      expect(signerItems.length).toBe(2)
    })

    it('handles very large weights', () => {
      const signers = [{ account: 'rSigner1', weight: 999999 }]

      render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(screen.getByText(/999,999/)).toBeInTheDocument()
    })

    it('handles mix of signers with and without weights', () => {
      const signers = [
        { account: 'rSigner1', weight: 1 },
        { account: 'rSigner2' },
        { account: 'rSigner3', weight: 3 },
      ]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      const weights = container.querySelectorAll('.signer-weight')
      expect(weights.length).toBe(2) // Only two signers have weights
    })
  })

  describe('List Structure', () => {
    it('contains signers-list container', () => {
      const signers = [{ account: 'rSigner1', weight: 1 }]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      expect(container.querySelector('.signers-list')).toBeInTheDocument()
    })

    it('each signer has signer-address element', () => {
      const signers = [
        { account: 'rSigner1', weight: 1 },
        { account: 'rSigner2', weight: 2 },
      ]

      const { container } = render(
        <TestWrapper>
          <SignersCard signers={signers} />
        </TestWrapper>,
      )

      const addresses = container.querySelectorAll('.signer-address')
      expect(addresses.length).toBe(2)
    })
  })
})
