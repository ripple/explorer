import { render } from '@testing-library/react'
import { Notification } from '../index'

/* eslint-disable react/jsx-props-no-spreading */
const VALID_USAGES = [
  'default',
  'success',
  'warning',
  'danger',
  'dark',
  'light',
  'dark50',
]
const notificationLevels = ['primary', 'secondary', 'ghost']
const message = 'A catchy message'
const renderComponent = (props) => render(<Notification {...props} />)

describe('<Notification />', () => {
  it('should render with custom className', () => {
    const className = 'test-class'
    const { container } = renderComponent({
      message,
      className,
    })

    expect(container.firstChild).toHaveClass(className)
  })

  it('should render the action button', () => {
    const { container } = renderComponent({
      message,
      action: <button type="button" data-testid="action-btn" />,
    })

    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('should render its message', () => {
    const { container } = renderComponent({
      message,
    })

    expect(container).toHaveTextContent(message)
  })

  // test all notification levels
  notificationLevels.forEach((level) => {
    it(`should accept level prop of ${level}`, () => {
      const { container } = renderComponent({
        level,
        message,
      })

      expect(container.querySelector('.notification')).toHaveClass(
        `${level}-theme`,
      )
    })
  })

  // test all notification usages
  VALID_USAGES.forEach((usage) => {
    it(`should render with usage prop of ${usage}`, () => {
      const { container } = renderComponent({
        usage,
        message,
      })
      expect(container.querySelector('.notification')).toHaveClass(usage)
    })
  })
})
