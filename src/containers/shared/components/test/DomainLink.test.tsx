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
    const url = 'https://example.com'
    const urlInHex = '68747470733A2F2F6578616D706C652E636F6D'
    const wrapper = mount(<DomainLink decode domain={urlInHex} />)
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual(url)
    expect(wrapper.find('a').props().href).toEqual(url)
    wrapper.unmount()
  })

  it('handles IPFS domain link', () => {
    const wrapper = mount(<DomainLink domain="ipfs://random/metadata.json" />)
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual('ipfs://random/metadata.json')
    expect(wrapper.find('a').props().href).toEqual(
      'https://ipfs.io/ipfs/random/metadata.json',
    )
    wrapper.unmount()
  })

  it('handles domain link with protocol removal', () => {
    const url = 'https://example.com/'
    const wrapper = mount(<DomainLink domain={url} keepProtocol={false} />)
    expect(wrapper.find('a').props().className).toEqual('domain')
    expect(wrapper.find('a').text()).toEqual('example.com')
    expect(wrapper.find('a').props().href).toEqual('https://example.com/')
  })
})
