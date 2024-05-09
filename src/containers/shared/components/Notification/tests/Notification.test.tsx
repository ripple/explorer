import { cleanup, render, screen } from '@testing-library/react'
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
  afterEach(cleanup)
  it('should render with custom className', () => {
    const className = 'test-class'
    renderComponent({
      message,
      className,
    })
    expect(screen.getByText(message).parentElement).toHaveClass(className)
  })

  it('should render the action button', () => {
    const action = <button type="button" />
    renderComponent({
      message,
      action,
    })

    expect(screen.queryByRole('button')).toBeDefined()
  })

  it('should render its message', () => {
    const { container } = renderComponent({
      message,
    })

    expect(container).toHaveTextContent(message)
  })

  // test all notification levels
  notificationLevels.map((level) => {
    it(`should accept level prop of ${level}`, () => {
      renderComponent({
        level,
        message,
      })
      expect(screen.getByText(message).parentElement).toHaveClass(
        `notification default ${level}-theme`,
      )
    })

    return false
  })

  // test all notification usages
  VALID_USAGES.map((usage) => {
    it(`should render with usage prop of ${usage}`, () => {
      renderComponent({
        usage,
        message,
      })
      expect(screen.getByText(message).parentElement).toHaveClass(usage)
    })

    return false
  })
})
