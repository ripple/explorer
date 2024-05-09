import { mount } from 'enzyme'
import { Notification } from '../components/Notification'

describe('Notification', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Notification key="key" usage="danger" message="boo!" />,
    )
    wrapper.unmount()
  })

  it('disappears', (done) => {
    const wrapper = mount(
      <Notification
        key="key"
        usage="danger"
        message="boo!"
        autoDismiss
        delay={100}
      />,
    )
    expect(wrapper.html()).toBe(
      '<div class="notification danger primary-theme "><span>boo!</span></div>',
    )

    setTimeout(() => {
      wrapper.update()
      expect(wrapper.html()).toBe(null)
      wrapper.unmount()
      done()
    }, 200)
  })
})
