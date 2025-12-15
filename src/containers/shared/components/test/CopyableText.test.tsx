import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { act } from 'react-dom/test-utils'
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

  const createWrapper = (props: { text: string; displayText: string }) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <CopyableText {...props} />
      </I18nextProvider>,
    )

  it('renders displayText correctly', () => {
    const wrapper = createWrapper({
      text: 'secret-value',
      displayText: 'Click me',
    })

    expect(wrapper.find('.copy-button').text()).toBe('Click me')
    wrapper.unmount()
  })

  it('copies text to clipboard when clicked', () => {
    const wrapper = createWrapper({
      text: 'secret-value-to-copy',
      displayText: 'Copy this',
    })

    wrapper.find('.copy-button').simulate('click')

    expect(mockWriteText).toHaveBeenCalledWith('secret-value-to-copy')
    wrapper.unmount()
  })

  it('shows "Click to copy" tooltip on hover', () => {
    const wrapper = createWrapper({
      text: 'value',
      displayText: 'Copy',
    })

    // Initially no tooltip
    expect(wrapper.find('.copy-tooltip').exists()).toBe(false)

    // Hover to show hint
    wrapper.find('.copy-button').simulate('mouseenter')
    wrapper.update()

    // Tooltip should appear with "Click to copy"
    expect(wrapper.find('.copy-tooltip').exists()).toBe(true)
    expect(wrapper.find('.copy-tooltip').text()).toBe('Click to copy')

    // Mouse leave hides tooltip
    wrapper.find('.copy-button').simulate('mouseleave')
    wrapper.update()
    expect(wrapper.find('.copy-tooltip').exists()).toBe(false)

    wrapper.unmount()
  })

  it('shows "Click to copy" tooltip on focus', () => {
    const wrapper = createWrapper({
      text: 'value',
      displayText: 'Copy',
    })

    // Focus to show hint
    wrapper.find('.copy-button').simulate('focus')
    wrapper.update()

    expect(wrapper.find('.copy-tooltip').exists()).toBe(true)
    expect(wrapper.find('.copy-tooltip').text()).toBe('Click to copy')

    // Blur hides tooltip
    wrapper.find('.copy-button').simulate('blur')
    wrapper.update()
    expect(wrapper.find('.copy-tooltip').exists()).toBe(false)

    wrapper.unmount()
  })

  it('shows "Copied" tooltip after clicking and hides it after 2 seconds', () => {
    const wrapper = createWrapper({
      text: 'value',
      displayText: 'Copy',
    })

    // Click to copy
    wrapper.find('.copy-button').simulate('click')
    wrapper.update()

    // Tooltip should show "Copied" with the copied class for green styling
    expect(wrapper.find('.copy-tooltip.copied').exists()).toBe(true)
    expect(wrapper.find('.copy-tooltip.copied').text()).toBe('Copied')

    // Fast-forward 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    wrapper.update()

    // Tooltip should disappear
    expect(wrapper.find('.copy-tooltip').exists()).toBe(false)
    wrapper.unmount()
  })
})
