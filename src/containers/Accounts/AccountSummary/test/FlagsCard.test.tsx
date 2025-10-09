import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import FlagsCard from '../FlagsCard'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('FlagsCard Component', () => {
  describe('Rendering', () => {
    it('renders the card with header', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      expect(screen.getByText('Flags')).toBeInTheDocument()
    })

    it('renders all 15 flag items', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flagItems = container.querySelectorAll('.flag-item')
      expect(flagItems.length).toBe(15)
    })
  })

  describe('Flag Status - Enabled(Yes)/Disabled(No)', () => {
    it('shows lsfGlobalFreeze as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfGlobalFreeze'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Global Freeze'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfGlobalFreeze as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Global Freeze'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisableMaster as enabled with "Yes" when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisableMaster'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Master Key'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Yes')
    })

    it('shows lsfDisableMaster as disabled with "No" when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Master Key'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('No')
    })

    it('shows lsfDefaultRipple as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDefaultRipple'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Rippling'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDefaultRipple as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Rippling'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfAllowTrustLineClawback as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfAllowTrustLineClawback'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Clawback'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfAllowTrustLineClawback as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Clawback'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfRequireDestTag as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfRequireDestTag'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Require Destination Tag'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfRequireDestTag as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Require Destination Tag'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfNoFreeze as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfNoFreeze'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('No Freeze'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfNoFreeze as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('No Freeze'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfRequireAuth as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfRequireAuth'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.querySelector('.flag-title')?.textContent ===
          'Require Authorization',
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfRequireAuth as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.querySelector('.flag-title')?.textContent ===
          'Require Authorization',
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisallowXRP as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisallowXRP'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('No XRP Allowed'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDisallowXRP as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('No XRP Allowed'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisallowIncomingTrustline as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisallowIncomingTrustline'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Trustlines'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDisallowIncomingTrustline as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Trustlines'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisallowIncomingPayChannel as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisallowIncomingPayChannel'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Payment Channels'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDisallowIncomingPayChannel as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Payment Channels'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisallowIncomingNFTokenOffer as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisallowIncomingNFTokenOffer'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block NFT Offers'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDisallowIncomingNFTokenOffer as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block NFT Offers'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows asfAuthorizedNFTokenMinter as enabled when nftMinter field is present', () => {
      const account = {
        info: {
          flags: [],
          nftMinter: 'rMinterAccount123',
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('NFT Minter'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows asfAuthorizedNFTokenMinter as disabled when nftMinter field is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('NFT Minter'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDisallowIncomingCheck as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDisallowIncomingCheck'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Checks'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDisallowIncomingCheck as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) => item.textContent?.includes('Block Checks'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows lsfDepositAuth as enabled when flag is present', () => {
      const account = {
        info: {
          flags: ['lsfDepositAuth'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.querySelector('.flag-title')?.textContent ===
          'Deposit Authorization',
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows lsfDepositAuth as disabled when flag is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.querySelector('.flag-title')?.textContent ===
          'Deposit Authorization',
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })

    it('shows asfAccountTxnID as enabled when accountTransactionID field is present', () => {
      const account = {
        info: {
          flags: [],
          accountTransactionID: 'ABCD1234',
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.textContent?.includes('Track Account Latest Transaction'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Enabled')
    })

    it('shows asfAccountTxnID as disabled when accountTransactionID field is not present', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flag = Array.from(container.querySelectorAll('.flag-item')).find(
        (item) =>
          item.textContent?.includes('Track Account Latest Transaction'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
      expect(flag?.querySelector('.flag-status')).toHaveTextContent('Disabled')
    })
  })

  describe('Multiple Flags', () => {
    it('handles multiple flags enabled simultaneously', () => {
      const account = {
        info: {
          flags: [
            'lsfGlobalFreeze',
            'lsfDefaultRipple',
            'lsfRequireDestTag',
            'lsfNoFreeze',
          ],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const enabledFlags = container.querySelectorAll('.flag-status.enabled')
      // At least 4 should be enabled (the ones we set)
      // Note: Some inverted flags might also be enabled by default
      expect(enabledFlags.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Flag Structure', () => {
    it('each flag has non-empty title, description, and status', () => {
      const account = {
        info: {
          flags: ['lsfGlobalFreeze'],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      const flagItems = container.querySelectorAll('.flag-item')
      flagItems.forEach((item) => {
        // Each flag must have all three elements
        const title = item.querySelector('.flag-title')
        const desc = item.querySelector('.flag-desc')
        const status = item.querySelector('.flag-status')

        expect(title).toBeInTheDocument()
        expect(desc).toBeInTheDocument()
        expect(status).toBeInTheDocument()

        // And none should be empty
        expect(title?.textContent).not.toBe('')
        expect(desc?.textContent).not.toBe('')
        expect(status?.textContent).not.toBe('')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined flags array', () => {
      const account = {
        info: {},
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      expect(screen.getByText('Flags')).toBeInTheDocument()
      const flagItems = container.querySelectorAll('.flag-item')
      expect(flagItems.length).toBe(15)
    })

    it('handles missing info object', () => {
      const account = {}

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      expect(screen.getByText('Flags')).toBeInTheDocument()
      const flagItems = container.querySelectorAll('.flag-item')
      expect(flagItems.length).toBe(15)
    })

    it('handles empty account object', () => {
      const account = {
        info: {
          flags: [],
        },
      }

      const { container } = render(
        <TestWrapper>
          <FlagsCard account={account} />
        </TestWrapper>,
      )

      expect(screen.getByText('Flags')).toBeInTheDocument()
      const flagItems = container.querySelectorAll('.flag-item')
      expect(flagItems.length).toBe(15)
    })
  })
})
