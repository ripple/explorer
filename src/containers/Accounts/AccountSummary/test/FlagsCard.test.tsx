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

  describe('Flag Status - Enabled/Disabled', () => {
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
    })

    it('shows lsfDisableMaster as enabled (inverted) when flag is NOT present', () => {
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
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
    })

    it('shows lsfDisableMaster as disabled (inverted) when flag IS present', () => {
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
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Trustlines Allowed'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Trustlines Allowed'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Payment Channels Allowed'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Payment Channels Allowed'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No NFT Offers Allowed'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No NFT Offers Allowed'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Checks Allowed'),
      )
      expect(flag?.querySelector('.flag-status.enabled')).toBeInTheDocument()
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
        (item) => item.textContent?.includes('No Checks Allowed'),
      )
      expect(flag?.querySelector('.flag-status.disabled')).toBeInTheDocument()
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
