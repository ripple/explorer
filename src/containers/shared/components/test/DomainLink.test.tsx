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
  it('handles domain link with domain provided in HEX-encoded format', () => {
    const wrapper = mount(
      <DomainLink decode domain="68747470733A2F2F6578616D706C652E636F6D" />,
    )
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual('https://example.com')
    expect(wrapper.find('a').props().href).toEqual('https://example.com')
    wrapper.unmount()
  })
})
