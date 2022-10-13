import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import Currency from '../Currency'

describe('Currency', () => {
  it('handles currency codes that are 3 characters ', () => {
    const wrapper = mount(<Currency currency="BTC" amount={5.001} />)
    expect(wrapper.find('.currency').text()).toEqual('BTC')
    wrapper.unmount()
  })

  it('handles currency codes that are 4 characters ', () => {
    const wrapper = mount(<Currency currency="WOOT" amount={5.001} />)
    expect(wrapper.find('.currency').text()).toEqual('WOOT')
    wrapper.unmount()
  })

  it('handles currency codes that are 40 characters ', () => {
    const wrapper = mount(
      <Currency
        currency="584D455441000000000000000000000000000000"
        amount={5.001}
      />,
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
          amount={5.001}
        />
        <Currency
          currency="USD"
          issuer="rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
          amount={15.01}
        />
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
})
