import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Currency from '../Currency';

describe('Currency', () => {
  it('handles currency codes that are 3 characters ', () => {
    const wrapper = mount(<Currency currency="BTC" amount={5.001} />);
    expect(wrapper.find('.currency').text()).toEqual('BTC');
    wrapper.unmount();
  });

  it('handles currency codes that are 4 characters ', () => {
    const wrapper = mount(<Currency currency="WOOT" amount={5.001} />);
    expect(wrapper.find('.currency').text()).toEqual('WOOT');
    wrapper.unmount();
  });

  it('handles currency codes that are 40 characters ', () => {
    const wrapper = mount(
      <Currency currency="584D455441000000000000000000000000000000" amount={5.001} />
    );
    expect(wrapper.find('.currency').text()).toEqual('XMETA');
    wrapper.unmount();
  });

  it('handles currency codes that are 40 characters and issuer ', () => {
    const wrapper = mount(
      <BrowserRouter>
        <Currency
          currency="584D455441000000000000000000000000000000"
          issuer="r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB"
          amount={5.001}
        />
      </BrowserRouter>
    );
    expect(wrapper.find('.currency').text()).toEqual('XMETA.r3XwJ1hr1PtbRvbhuUkybV6tmYzzA11WcB');
    wrapper.unmount();
  });
});
