import { mount } from 'enzyme'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  let sandbox

  beforeAll(() => {
    sandbox = document.createElement('div')
    document.body.appendChild(sandbox)
  })

  afterAll(() => {
    if (sandbox) {
      document.body.removeChild(sandbox)
    }
  })

  describe('prop: title', () => {
    it('renders when it is jsx', () => {
      const title = <span className="title-component">Woo</span>
      const wrapper = mount(<Dropdown title={title}>Menu Contents</Dropdown>)
      expect(wrapper.find('.title-component')).toExist()
      expect(wrapper.find('.title-component')).toHaveText('Woo')
      wrapper.unmount()
    })
    it('renders when it is a string', () => {
      const title = 'Woo'
      const wrapper = mount(<Dropdown title={title}>Menu Contents</Dropdown>)
      expect(wrapper.find('.dropdown-toggle')).toIncludeText(title)
      wrapper.unmount()
    })
  })
  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      const wrapper = mount(
        <Dropdown title="Woo" className="dropdown-custom">
          Menu Contents
        </Dropdown>,
      )
      expect(wrapper.find('.dropdown')).toHaveClassName('dropdown-custom')
      wrapper.unmount()
    })
  })

  it('shows menu when clicking toggle', () => {
    const wrapper = mount(<Dropdown title="Woo">Menu Contents</Dropdown>)
    expect(wrapper.find('.dropdown')).not.toHaveClassName('dropdown-expanded')
    wrapper.find('.dropdown-toggle').simulate('click')
    expect(wrapper.find('.dropdown')).toHaveClassName('dropdown-expanded')
    wrapper.find('.dropdown-toggle').simulate('click')
    expect(wrapper.find('.dropdown')).not.toHaveClassName('dropdown-expanded')
    wrapper.unmount()
  })

  it('hides menu when clicking toggle outside the component', () => {
    const wrapper = mount(
      <div className="container">
        <Dropdown title="Woo">
          <div className="child">Menu Contents</div>
        </Dropdown>
        <button type="button" className="outside">
          Outside
        </button>
      </div>,
      { attachTo: sandbox },
    )
    expect(wrapper.find('.dropdown')).not.toHaveClassName('dropdown-expanded')
    wrapper.find('.dropdown-toggle').simulate('click')
    expect(wrapper.find('.dropdown')).toHaveClassName('dropdown-expanded')
    wrapper.find('.child').getDOMNode<HTMLElement>().click() // simulate does not bubble
    wrapper.update()
    expect(wrapper.find('.dropdown')).toHaveClassName('dropdown-expanded')
    wrapper.find('.outside').getDOMNode<HTMLElement>().click() // simulate does not bubble
    wrapper.update()
    expect(wrapper.find('.dropdown')).not.toHaveClassName('dropdown-expanded')
    wrapper.unmount()
  })

  it('adds aria roles', () => {
    const wrapper = mount(<Dropdown title="Woo">Menu Contents</Dropdown>)
    const toggle = wrapper.find('.dropdown-toggle')
    const menu = wrapper.find('.dropdown-menu')
    expect(toggle).toHaveProp('aria-haspopup', 'true')
    expect(toggle).toHaveProp('tabIndex', 0)
    expect(menu).toHaveProp('role', 'menu')
    expect(menu).toHaveProp('tabIndex', 0)
    toggle.simulate('click')
    expect(wrapper.find('.dropdown-toggle')).toHaveProp('aria-expanded', true)
    expect(wrapper.find('.dropdown-menu')).toHaveProp('aria-hidden', false)
  })
})
