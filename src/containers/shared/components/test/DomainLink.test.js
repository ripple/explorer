import { mount } from 'enzyme'
import DomainLink from '../DomainLink'

describe('DomainLink', () => {
  it('handles domain link with only domain parameter', () => {
    const wrapper = mount(<DomainLink domain="bithomp.com" />)
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual('bithomp.com')
    expect(wrapper.find('a').props().href).toEqual('https://bithomp.com')
    wrapper.unmount()
  })
  it('handles domain link with decoded domain parameter', () => {
    const wrapper = mount(
      <DomainLink decode domain="736F6C6F67656E69632E636F6D" />,
    )
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual('sologenic.com')
    expect(wrapper.find('a').props().href).toEqual('https://sologenic.com')
    wrapper.unmount()
  })
  it('handles domain link with domain parameter and classname', () => {
    const wrapper = mount(<DomainLink className="test" domain="bithomp.com" />)
    expect(wrapper.find('a').props().className).toEqual('domain test')
    expect(wrapper.find('a').text()).toEqual('bithomp.com')
    expect(wrapper.find('a').props().href).toEqual('https://bithomp.com')
    wrapper.unmount()
  })
  it('handles domain link with decoded domain parameter and classname', () => {
    const wrapper = mount(
      <DomainLink
        className="test"
        decode
        domain="736F6C6F67656E69632E636F6D"
      />,
    )
    expect(wrapper.find('a').props().className).toEqual('domain test')
    expect(wrapper.find('a').text()).toEqual('sologenic.com')
    expect(wrapper.find('a').props().href).toEqual('https://sologenic.com')
    wrapper.unmount()
  })
})
