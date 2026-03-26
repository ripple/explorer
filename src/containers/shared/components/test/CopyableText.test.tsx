import { render, fireEvent, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfigEnglish'
import { CopyableText } from '../CopyableText'

// Mock clipboard API
const mockWriteText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('CopyableText', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderCopyableText = (props: { text: string; displayText: string }) =>
    render(
      <I18nextProvider i18n={i18n}>
        <CopyableText text={props.text} displayText={props.displayText} />
      </I18nextProvider>,
    )

  it('renders displayText correctly', () => {
    const { container } = renderCopyableText({
      text: 'secret-value',
      displayText: 'Click me',
    })

    expect(container.querySelector('.copy-button')).toHaveTextContent(
      'Click me',
    )
  })

  it('copies text to clipboard when clicked', () => {
    const { container } = renderCopyableText({
      text: 'secret-value-to-copy',
      displayText: 'Copy this',
    })

    fireEvent.click(container.querySelector('.copy-button')!)

    expect(mockWriteText).toHaveBeenCalledWith('secret-value-to-copy')
  })

  it('shows "Click to copy" tooltip on hover', () => {
    const { container } = renderCopyableText({
      text: 'value',
      displayText: 'Copy',
    })

    // Initially no tooltip
    expect(container.querySelector('.copy-tooltip')).not.toBeInTheDocument()

    // Hover to show hint
    fireEvent.mouseEnter(container.querySelector('.copy-button')!)

    // Tooltip should appear with "Click to copy"
    expect(container.querySelector('.copy-tooltip')).toBeInTheDocument()
    expect(container.querySelector('.copy-tooltip')).toHaveTextContent(
      'Click to copy',
    )

    // Mouse leave hides tooltip
    fireEvent.mouseLeave(container.querySelector('.copy-button')!)
    expect(container.querySelector('.copy-tooltip')).not.toBeInTheDocument()
  })

  it('shows "Click to copy" tooltip on focus', () => {
    const { container } = renderCopyableText({
      text: 'value',
      displayText: 'Copy',
    })

    // Focus to show hint
    fireEvent.focus(container.querySelector('.copy-button')!)

    expect(container.querySelector('.copy-tooltip')).toBeInTheDocument()
    expect(container.querySelector('.copy-tooltip')).toHaveTextContent(
      'Click to copy',
    )

    // Blur hides tooltip
    fireEvent.blur(container.querySelector('.copy-button')!)
    expect(container.querySelector('.copy-tooltip')).not.toBeInTheDocument()
  })

  it('shows "Copied" tooltip after clicking and hides it after 2 seconds', () => {
    const { container } = renderCopyableText({
      text: 'value',
      displayText: 'Copy',
    })

    // Click to copy
    fireEvent.click(container.querySelector('.copy-button')!)

    // Tooltip should show "Copied" with the copied class for green styling
    expect(container.querySelector('.copy-tooltip.copied')).toBeInTheDocument()
    expect(container.querySelector('.copy-tooltip.copied')).toHaveTextContent(
      'Copied',
    )

    // Fast-forward 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // Tooltip should disappear
    expect(container.querySelector('.copy-tooltip')).not.toBeInTheDocument()
  })
})
