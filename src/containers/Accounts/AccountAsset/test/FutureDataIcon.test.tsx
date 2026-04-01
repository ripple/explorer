import { render, screen, fireEvent } from '@testing-library/react'
import { FutureDataIcon } from '../FutureDataIcon'
import { TooltipProvider } from '../../../shared/components/Tooltip'

// Mock the SVG import
jest.mock('../../../shared/images/clock-icon.svg', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <svg data-testid="clock-icon" className={className} />
  ),
}))

// Mock the useTooltip hook
const mockShowTooltip = jest.fn()
const mockHideTooltip = jest.fn()

jest.mock('../../../shared/components/Tooltip', () => ({
  ...jest.requireActual('../../../shared/components/Tooltip'),
  useTooltip: () => ({
    showTooltip: mockShowTooltip,
    hideTooltip: mockHideTooltip,
  }),
}))

// Helper to render component with TooltipProvider
const renderWithTooltipProvider = (component: React.ReactElement) =>
  render(<TooltipProvider>{component}</TooltipProvider>)

describe('FutureDataIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 200,
      right: 120,
      bottom: 220,
      width: 20,
      height: 20,
      x: 100,
      y: 200,
      toJSON: () => {},
    }))

    // Mock window.scrollX and window.scrollY
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders the clock icon', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByTestId('clock-icon')).toHaveClass('clock-icon')
    })

    it('renders with default message when no message prop provided', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'This data will be provided in a future release.',
        expect.objectContaining({
          x: 110, // 100 + 10 (TOOLTIP_X_OFFSET)
          y: 80, // 200 + 0 - 120 (TOOLTIP_Y_OFFSET)
        }),
      )
    })

    it('renders with custom message when message prop provided', () => {
      const customMessage = 'Custom future data message'
      renderWithTooltipProvider(<FutureDataIcon message={customMessage} />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        customMessage,
        expect.any(Object),
      )
    })
  })

  describe('Mouse Interactions', () => {
    it('shows tooltip on mouse over', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledTimes(1)
      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'This data will be provided in a future release.',
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        }),
      )
    })

    it('hides tooltip on mouse leave', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseLeave(futureDataSpan)

      expect(mockHideTooltip).toHaveBeenCalledTimes(1)
    })

    it('shows and hides tooltip on mouse over and leave sequence', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')

      fireEvent.mouseOver(futureDataSpan)
      expect(mockShowTooltip).toHaveBeenCalledTimes(1)

      fireEvent.mouseLeave(futureDataSpan)
      expect(mockHideTooltip).toHaveBeenCalledTimes(1)
    })
  })

  describe('Tooltip Positioning', () => {
    it('calculates correct tooltip position with scroll offset', () => {
      // Set scroll values
      Object.defineProperty(window, 'scrollX', { value: 50, writable: true })
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })

      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        'This data will be provided in a future release.',
        {
          x: 160, // 100 (left) + 50 (scrollX) + 10 (TOOLTIP_X_OFFSET)
          y: 180, // 200 (top) + 100 (scrollY) - 120 (TOOLTIP_Y_OFFSET)
        },
      )
    })

    it('uses correct offset constants', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        expect.any(String),
        {
          x: 110, // Confirms TOOLTIP_X_OFFSET = 10
          y: 80, // Confirms TOOLTIP_Y_OFFSET = -120
        },
      )
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple rapid mouse events', () => {
      renderWithTooltipProvider(<FutureDataIcon />)

      const futureDataSpan = screen.getByRole('button')

      // Rapid mouse events
      fireEvent.mouseOver(futureDataSpan)
      fireEvent.mouseOver(futureDataSpan)
      fireEvent.mouseLeave(futureDataSpan)
      fireEvent.mouseOver(futureDataSpan)
      fireEvent.mouseLeave(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledTimes(3)
      expect(mockHideTooltip).toHaveBeenCalledTimes(2)
    })

    it('handles empty message prop', () => {
      renderWithTooltipProvider(<FutureDataIcon message="" />)

      const futureDataSpan = screen.getByRole('button')
      fireEvent.mouseOver(futureDataSpan)

      expect(mockShowTooltip).toHaveBeenCalledWith(
        'text',
        expect.any(Object),
        '',
        expect.any(Object),
      )
    })
  })
})
