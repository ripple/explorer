import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import Currency from '../Currency'

describe('Currency', () => {
  it('handles currency codes that are 3 characters ', () => {
    const wrapper = mount(<Currency currency="BTC" />)
    expect(wrapper.find('.currency').text()).toEqual('BTC')
    wrapper.unmount()
  })

  it('handles currency codes that are 4 characters ', () => {
    const wrapper = mount(<Currency currency="WOOT" />)
    expect(wrapper.find('.currency').text()).toEqual('WOOT')
    wrapper.unmount()
  })

  it('handles currency codes that are 4 characters and include issuer ', () => {
    const wrapper = mount(
      <Currency currency="USD" issuer="david" link={false} shortenIssuer />,
    )
    expect(wrapper.find('.currency').text()).toEqual('USD.davi')
    wrapper.unmount()
  })

  it('handles currency codes that are 40 characters ', () => {
    const wrapper = mount(
      <Currency currency="584D455441000000000000000000000000000000" />,
    )
    expect(wrapper.find('.currency').text()).toEqual('XMETA')
    wrapper.unmount()
  })

  it('handles currency codes that are 40 characters and issuer ', () => {
    const wrapper = mount(
      <BrowserRouter>
        <Currency
          currency="584D455441000000000000000000000000000000"
          issuer="r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB"
        />
        <Currency currency="USD" issuer="rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq" />
      </BrowserRouter>,
    )
    const meta = wrapper.find('.currency').at(0)
    const usd = wrapper.find('.currency').at(1)

    expect(meta).toHaveText('XMETA.r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB')
    expect(meta.find('a')).toHaveProp(
      'href',
      '/token/584D455441000000000000000000000000000000.r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB',
    )

    expect(usd).toHaveText('USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq')
    expect(usd.find('a')).toHaveProp(
      'href',
      '/token/USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    )
    wrapper.unmount()
  })

  it('displays the XRP symbol when rendering XRP', () => {
    const wrapper = mount(<Currency currency="XRP" />)
    expect(wrapper.find('.currency').text()).toEqual('\uE900 XRP')
    wrapper.unmount()
  })

  it('handles MPT ID ', () => {
    const wrapper = mount(
      <BrowserRouter>
        <Currency
          currency="00000BDE5B4F868ECE457207E2C1750065987730B8839E0D"
          issuer="r9Kokzc4FC1BW81pDarodghf3n8w2vufhW"
          isMPT
        />
      </BrowserRouter>,
    )
    const mpt = wrapper.find('.currency').at(0)

    expect(mpt).toHaveText(
      'MPT (00000BDE5B4F868ECE457207E2C1750065987730B8839E0D)',
    )
    expect(mpt.find('a')).toHaveProp(
      'href',
      '/mpt/00000BDE5B4F868ECE457207E2C1750065987730B8839E0D',
    )
    wrapper.unmount()
  })
})
