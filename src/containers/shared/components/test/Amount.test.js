import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Amount } from '../Amount';

describe('Amount', () => {
  it('handles currency codes that are 3 characters ', () => {
    const value = {
      amount: 95.13258522535791,
      currency: 'DYM',
      issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    };

    const wrapper = mount(
      <BrowserRouter>
        <Amount value={value} />
      </BrowserRouter>
    );
    expect(wrapper.find('.currency').text()).toEqual('DYM.rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E');
    expect(wrapper.find('.amount-localized').text()).toEqual('95.13258523');
    wrapper.unmount();
  });

  it('handles currency codes with standard symbols', () => {
    const value = {
      amount: 4986.30908732758,
      currency: 'JPY',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    };

    const wrapper = mount(
      <BrowserRouter>
        <Amount value={value} />
      </BrowserRouter>
    );
    expect(wrapper.find('.currency').text()).toEqual('JPY.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B');
    expect(wrapper.find('.amount-localized').text()).toEqual('¥4,986.30908733');
    wrapper.unmount();

    const value2 = {
      amount: 78.5098894970562,
      currency: 'GBP',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
    };

    const wrapper2 = mount(
      <BrowserRouter>
        <Amount value={value2} />
      </BrowserRouter>
    );
    expect(wrapper2.find('.currency').text()).toEqual('GBP.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B');
    expect(wrapper2.find('.amount-localized').text()).toEqual('£78.5098895');
    wrapper2.unmount();
  });

  it('handles currency codes that are 4 characters ', () => {
    const value = {
      amount: 95.13258522535791,
      currency: 'WOOT',
      issuer: 'rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E',
    };

    const wrapper = mount(
      <BrowserRouter>
        <Amount value={value} />
      </BrowserRouter>
    );
    expect(wrapper.find('.currency').text()).toEqual('WOOT.rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E');
    expect(wrapper.find('.amount-localized').text()).toEqual('95.13258523');
    wrapper.unmount();
  });

  it('handles currency codes that are 40 characters ', () => {
    const value = {
      amount: 3.692385398244198,
      currency: '0158415500000000C1F76FF6ECB0BAC600000000',
      issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
    };
    const wrapper = mount(
      <BrowserRouter>
        <Amount value={value} />
      </BrowserRouter>
    );
    expect(wrapper.find('.currency').text()).toEqual(
      'XAUÁ÷oöì°ºÆ.rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67'
    );
    expect(wrapper.find('.amount-localized').text()).toEqual('3.6923854');
    wrapper.unmount();
  });

  it('handles currency codes that are 40 characters and hidden issuer', () => {
    const value = {
      amount: 3.692385398244198,
      currency: '0158415500000000C1F76FF6ECB0BAC600000000',
      issuer: 'rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67',
    };
    const wrapper = mount(
      <BrowserRouter>
        <Amount value={value} displayIssuer={false} />
      </BrowserRouter>
    );
    console.log(wrapper.find('.currency').text());
    expect(wrapper.find('.currency').text()).toEqual('XAUÁ÷oöì°ºÆ');
    expect(wrapper.find('.amount-localized').text()).toEqual('3.6923854');
    wrapper.unmount();
  });
});
