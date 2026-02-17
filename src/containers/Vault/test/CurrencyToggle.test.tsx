/**
 * CurrencyToggle Component Unit Tests
 *
 * This test suite validates the CurrencyToggle component which allows users
 * to switch between viewing values in the vault's native currency or USD.
 *
 * Key concepts tested:
 * - Basic rendering (native currency button, USD button, help icon)
 * - Toggle functionality (clicking buttons triggers onToggle callback)
 * - Active state styling (selected currency shows active class)
 * - USD button disabled state (when conversion rate is unavailable)
 * - USD button loading state (while fetching conversion rate)
 * - Tooltip behavior (help icon, disabled/loading tooltips)
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfigEnglish'
import { CurrencyToggle } from '../CurrencyToggle'

// Mock the useTooltip hook
const mockShowTooltip = jest.fn()
const mockHideTooltip = jest.fn()
jest.mock('../../shared/components/Tooltip', () => ({
  useTooltip: () => ({
    showTooltip: mockShowTooltip,
    hideTooltip: mockHideTooltip,
  }),
}))

/**
 * TestWrapper Component
 *
 * Provides I18nextProvider for translated text in the component.
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('CurrencyToggle Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * =========================================
   * SECTION 1: Basic Rendering Tests
   * =========================================
   * Verify the component renders all expected elements.
   */
  describe('Basic Rendering', () => {
    it('renders native currency and USD button', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>ABC</span>}
            selected="ABC"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('ABC')).toBeInTheDocument()
      expect(screen.getByText('USD')).toBeInTheDocument()
    })

    it('renders help icon', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      expect(screen.getByText('?')).toBeInTheDocument()
    })
  })

  /**
   * =========================================
   * SECTION 2: Active State Tests
   * =========================================
   * Verify correct styling when each currency is selected.
   */
  describe('Active State', () => {
    it('shows native currency button as active when selected is not USD', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const nativeButton = screen.getByText('XRP').closest('button')
      expect(nativeButton).toHaveClass('active')
    })

    it('shows USD button as active when selected is "USD"', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="USD"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).toHaveClass('active')
    })

    it('native currency button is not active when USD is selected', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="USD"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const nativeButton = screen.getByText('XRP').closest('button')
      expect(nativeButton).not.toHaveClass('active')
    })

    it('USD button is not active when native currency is selected', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).not.toHaveClass('active')
    })
  })

  /**
   * =========================================
   * SECTION 3: Toggle Functionality Tests
   * =========================================
   * Verify clicking buttons triggers the onToggle callback correctly.
   */
  describe('Toggle Functionality', () => {
    it('calls onToggle with empty string when native currency button is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('XRP'))
      // Empty string indicates native currency
      expect(onToggle).toHaveBeenCalledWith('')
    })

    it('calls onToggle with "USD" when USD button is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('USD'))
      expect(onToggle).toHaveBeenCalledWith('USD')
    })

    it('allows clicking native currency button even when already selected', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('XRP'))
      // Empty string indicates native currency
      expect(onToggle).toHaveBeenCalledWith('')
    })
  })

  /**
   * =========================================
   * SECTION 4: USD Disabled State Tests
   * =========================================
   * When USD conversion rate is unavailable, the USD button should be disabled.
   */
  describe('USD Disabled State (Rate Unavailable)', () => {
    it('disables USD button when usdDisabled is true', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).toBeDisabled()
    })

    it('adds disabled class when usdDisabled is true', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).toHaveClass('disabled')
    })

    it('does not call onToggle when disabled USD button is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('USD'))
      expect(onToggle).not.toHaveBeenCalled()
    })

    it('native currency button still works when USD is disabled', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="USD"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('XRP'))
      // Empty string indicates switching back to native currency
      expect(onToggle).toHaveBeenCalledWith('')
    })

    it('shows unavailable tooltip on hover when USD is disabled', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      // Mouse events are on the wrapper span, not the disabled button
      const wrapper = usdButton.parentElement!
      fireEvent.mouseEnter(wrapper)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'USD conversion not available for this token',
      )
    })

    it('hides tooltip on mouse leave', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      // Mouse events are on the wrapper span, not the disabled button
      const wrapper = usdButton.parentElement!
      fireEvent.mouseEnter(wrapper)
      fireEvent.mouseLeave(wrapper)

      expect(mockHideTooltip).toHaveBeenCalled()
    })
  })

  /**
   * =========================================
   * SECTION 5: USD Loading State Tests
   * =========================================
   * While fetching conversion rate, show loading state.
   */
  describe('USD Loading State', () => {
    it('shows "..." instead of "USD" when loading', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdLoading
          />
        </TestWrapper>,
      )

      expect(screen.getByText('...')).toBeInTheDocument()
      expect(screen.queryByText('USD')).not.toBeInTheDocument()
    })

    it('disables USD button when loading', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdLoading
          />
        </TestWrapper>,
      )

      const loadingButton = screen.getByText('...')
      expect(loadingButton).toBeDisabled()
    })

    it('adds disabled class when loading', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdLoading
          />
        </TestWrapper>,
      )

      const loadingButton = screen.getByText('...')
      expect(loadingButton).toHaveClass('disabled')
    })

    it('does not call onToggle when loading USD button is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdLoading
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('...'))
      expect(onToggle).not.toHaveBeenCalled()
    })

    it('shows loading tooltip on hover when loading', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdLoading
          />
        </TestWrapper>,
      )

      const loadingButton = screen.getByText('...')
      // Mouse events are on the wrapper span, not the disabled button
      const wrapper = loadingButton.parentElement!
      fireEvent.mouseEnter(wrapper)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'Loading USD conversion rate...',
      )
    })
  })

  /**
   * =========================================
   * SECTION 6: Help Icon Tooltip Tests
   * =========================================
   * Verify the help icon shows tooltip on hover.
   */
  describe('Help Icon Tooltip', () => {
    it('shows help tooltip on hover', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>EUR</span>}
            selected="EUR"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const helpIcon = screen.getByText('?')
      fireEvent.mouseEnter(helpIcon)

      // The tooltip text is a static i18n key
      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'Toggle to view values in native-currency or USD',
      )
    })

    it('hides help tooltip on mouse leave', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const helpIcon = screen.getByText('?')
      fireEvent.mouseEnter(helpIcon)
      fireEvent.mouseLeave(helpIcon)

      expect(mockHideTooltip).toHaveBeenCalled()
    })
  })

  /**
   * =========================================
   * SECTION 7: Enabled USD State Tests
   * =========================================
   * When USD conversion is available and not loading.
   */
  describe('USD Enabled State (Rate Available)', () => {
    it('USD button is enabled by default (no usdDisabled or usdLoading)', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).not.toBeDisabled()
      expect(usdButton).not.toHaveClass('disabled')
    })

    it('USD button is enabled when usdDisabled is explicitly false', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled={false}
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      expect(usdButton).not.toBeDisabled()
    })

    it('does not show tooltip on hover when USD is enabled', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      const usdButton = screen.getByText('USD')
      // Mouse events are on the wrapper span
      const wrapper = usdButton.parentElement!
      fireEvent.mouseEnter(wrapper)

      // showTooltip should not be called because getUsdTooltip returns ''
      expect(mockShowTooltip).not.toHaveBeenCalled()
    })

    it('calls onToggle when enabled USD button is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
            usdDisabled={false}
            usdLoading={false}
          />
        </TestWrapper>,
      )

      fireEvent.click(screen.getByText('USD'))
      expect(onToggle).toHaveBeenCalledWith('USD')
    })
  })

  /**
   * =========================================
   * SECTION 8: JSX Display Prop Tests
   * =========================================
   * Test the nativeCurrencyDisplay prop for custom JSX rendering.
   */
  describe('JSX Display Prop (nativeCurrencyDisplay)', () => {
    it('renders nativeCurrencyDisplay when provided', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={
              <span data-testid="custom-display">Custom-XRP</span>
            }
            selected="Custom-XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      expect(screen.getByTestId('custom-display')).toBeInTheDocument()
      expect(screen.getByText('Custom-XRP')).toBeInTheDocument()
    })

    it('calls onToggle with empty string when JSX display is clicked', () => {
      const onToggle = jest.fn()

      render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>MPT (ABC123...)</span>}
            selected="ABC123"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      // Click the native currency button (which shows the JSX display)
      fireEvent.click(screen.getByText('MPT (ABC123...)'))
      // Empty string indicates switching to native currency
      expect(onToggle).toHaveBeenCalledWith('')
    })
  })

  /**
   * =========================================
   * SECTION 9: Edge Cases
   * =========================================
   * Test edge cases and unusual inputs.
   */
  describe('Edge Cases', () => {
    it('maintains correct state after multiple toggles', () => {
      const selections: string[] = []
      const onToggle = (currency: string) => {
        selections.push(currency)
      }

      const { rerender } = render(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="XRP"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      // Click USD
      fireEvent.click(screen.getByText('USD'))
      expect(selections).toContain('USD')

      // Rerender with USD selected
      rerender(
        <TestWrapper>
          <CurrencyToggle
            nativeCurrencyDisplay={<span>XRP</span>}
            selected="USD"
            onToggle={onToggle}
          />
        </TestWrapper>,
      )

      // Click native currency button - passes empty string to switch to native
      fireEvent.click(screen.getByText('XRP'))
      expect(selections).toContain('')

      // Both clicks resulted in expected callbacks
      expect(selections).toEqual(['USD', ''])
    })
  })
})
