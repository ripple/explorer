import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import DetailsCard from '../DetailsCard'

// Mock the Account component
jest.mock('../../../shared/components/Account', () => ({
  Account: ({ account }: { account: string }) => (
    <span data-testid="account-component">{account}</span>
  ),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Router>{children}</Router>
  </I18nextProvider>
)

describe('DetailsCard Component', () => {
  describe('Rendering', () => {
    it('renders card header and required fields', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 5,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      // Verify card header
      expect(screen.getByText('Details')).toBeInTheDocument()

      // Verify current sequence field
      expect(screen.getByText('Current Sequence')).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()

      // Verify ticket count field
      expect(screen.getByText('Ticket Count')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('Optional Fields', () => {
    it('renders email hash when present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
          emailHash: 'ABC123DEF456',
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('Email Hash')).toBeInTheDocument()
      expect(screen.getByText('ABC123DEF456')).toBeInTheDocument()
    })

    it('does not render email hash when not present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.queryByText('Email Hash')).not.toBeInTheDocument()
    })

    it('renders payment channels when present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
        },
        paychannels: {
          total_available: 100,
          channels: [{ id: '1' }, { id: '2' }, { id: '3' }],
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('Payment Channels')).toBeInTheDocument()
      // Should show formatted text with both amount and number of channels
      expect(screen.getByText(/100\.00.*3 channel\(s\)/i)).toBeInTheDocument()
    })

    it('does not render payment channels when not present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.queryByText('Payment Channels')).not.toBeInTheDocument()
    })

    it('renders NFT minter when present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
          nftMinter: 'rNFTMinterAccount123',
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('NFT Minter')).toBeInTheDocument()
      expect(screen.getByTestId('account-component')).toHaveTextContent(
        'rNFTMinterAccount123',
      )
    })

    it('does not render NFT minter when not present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.queryByText('NFT Minter')).not.toBeInTheDocument()
    })
  })

  describe('Number Formatting', () => {
    it('formats sequence and ticket count with commas for large numbers', () => {
      const account = {
        info: {
          sequence: 1234567,
          ticketCount: 1000,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('1,234,567')).toBeInTheDocument()
      expect(screen.getByText('1,000')).toBeInTheDocument()
    })

    it('handles zero values', () => {
      const account = {
        info: {
          sequence: 0,
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      const zeroElements = screen.getAllByText('0')
      expect(zeroElements.length).toBe(2)
    })
  })

  describe('Combined Optional Fields', () => {
    it('renders all optional fields when present', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 5,
          emailHash: 'ABC123',
          nftMinter: 'rMinter123',
        },
        paychannels: {
          total_available: 100,
          channels: [{ id: '1' }, { id: '2' }],
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('Email Hash')).toBeInTheDocument()
      expect(screen.getByText('Payment Channels')).toBeInTheDocument()
      expect(screen.getByText('NFT Minter')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined sequence', () => {
      const account = {
        info: {
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('Current Sequence')).toBeInTheDocument()
    })

    it('handles undefined ticket count', () => {
      const account = {
        info: {
          sequence: 123,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      expect(screen.getByText('Ticket Count')).toBeInTheDocument()
    })

    it('handles empty paychannels array', () => {
      const account = {
        info: {
          sequence: 123,
          ticketCount: 0,
        },
        paychannels: {
          total_available: 0,
          channels: [],
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="en-US" />
        </TestWrapper>,
      )

      // Should not render payment channels if total_available is 0 (falsy)
      expect(screen.queryByText('Payment Channels')).not.toBeInTheDocument()
    })
  })

  describe('Language Support', () => {
    it('accepts different language codes', () => {
      const account = {
        info: {
          sequence: 1234567,
          ticketCount: 0,
        },
      }

      render(
        <TestWrapper>
          <DetailsCard account={account} lang="ja-JP" />
        </TestWrapper>,
      )

      expect(screen.getByText('Details')).toBeInTheDocument()
    })
  })
})
