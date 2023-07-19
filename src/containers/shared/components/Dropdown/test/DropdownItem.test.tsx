import { mount } from 'enzyme'
import { DropdownItem } from '../DropdownItem'
import createSpy = jasmine.createSpy

describe('DropdownItem', () => {
  describe(`prop: className`, () => {
    it('renders with custom className', () => {
      const wrapper = mount(
        <DropdownItem className="custom">Hello</DropdownItem>,
      )
      expect(wrapper.find('.dropdown-item')).toHaveClassName('custom')
    })
  })

  describe('prop: handler', () => {
    let wrapper
    const handler = createSpy('handler')

    beforeEach(() => {
      wrapper = mount(<DropdownItem handler={handler}>Hello</DropdownItem>)
    })

    it('renders as an anchor tag', () => {
      expect(wrapper.find('.dropdown-item')).toHaveDisplayName('a')
    })

    it('executes handler on click', () => {
      wrapper.find('.dropdown-item').simulate('click')
      expect(handler).toHaveBeenCalled()
    })

    it('executes handler on keyup', () => {
      wrapper.find('.dropdown-item').simulate('click')
      expect(handler).toHaveBeenCalled()
    })
  })

  describe('prop: href', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(
        <DropdownItem href="http://google.com">Hello</DropdownItem>,
      )
    })

    it('renders as an anchor tag', () => {
      expect(wrapper.find('.dropdown-item')).toHaveDisplayName('a')
    })

    it('renders href attribute on anchor', () => {
      expect(wrapper.find('.dropdown-item')).toHaveProp('href')
    })
  })

  it('renders as div without handler or href', () => {
    const wrapper = mount(<DropdownItem>Hello</DropdownItem>)
    expect(wrapper.find('.dropdown-item')).toHaveDisplayName('div')
  })

  it('adds aria roles', () => {
    const wrapper = mount(<DropdownItem>Hello</DropdownItem>)
    expect(wrapper.find('.dropdown-item')).toHaveProp('role', 'menuitem')
  })
})
