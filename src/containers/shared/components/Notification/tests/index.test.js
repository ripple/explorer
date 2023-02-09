import { mount } from 'enzyme'
import Notification from '../index'

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
const renderComponent = (props) => mount(<Notification {...props} />)

describe('<Notification />', () => {
  it('should render with custom className', () => {
    const className = 'test-class'
    const wrapper = renderComponent({
      message,
      className,
    })

    expect(wrapper.hasClass(className)).toEqual(true)
  })

  it('should render the action button', () => {
    const action = <button type="button" />
    const wrapper = renderComponent({
      message,
      action,
    })

    expect(wrapper.containsMatchingElement(action)).toEqual(true)
  })

  it('should render its message', () => {
    const wrapper = renderComponent({
      message,
    })

    expect(wrapper.containsMatchingElement(message)).toEqual(true)
  })

  // test all notification levels
  notificationLevels.map((level) => {
    it(`should accept level prop of ${level}`, () => {
      const wrapper = renderComponent({
        level,
        message,
      })
      const wrapperProps = wrapper.props()

      expect(wrapperProps.level).toEqual(level)
    })

    return false
  })

  // test all notification usages
  VALID_USAGES.map((usage) => {
    it(`should render with usage prop of ${usage}`, () => {
      const wrapper = renderComponent({
        usage,
        message,
      })
      const wrapperProps = wrapper.props()
      expect(wrapperProps.usage).toEqual(usage)
    })

    return false
  })
})
