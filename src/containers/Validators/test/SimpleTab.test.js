import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import SimpleTab from '../SimpleTab';

describe('SimpleTab container', () => {
  const createWrapper = (width = 1200) =>
    mount(
      <Router>
        <SimpleTab
          t={s => s}
          language="en-US"
          data={{
            master_key: 'nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C',
            signing_key: 'n9KNmrXo9gK3ucZy8KHKFM113ENGv6uyukS6Bb7TtuvEx98SdwMS',
            ledger_hash: 'D498209A1B1BBACB9D7C8419F9A4136E7F7748E66B7936D2F92249A2C1AFBCB9',
            ledger_index: 55764842,
            load_fee: null,
            partial: false,
            chain: null,
            unl: 'vl.ripple.com',
            last_ledger_time: '2020-05-28T09:21:19.000Z',
            agreement_1hour: {
              score: 1,
              missed: 0,
              incomplete: false,
            },
            agreement_24hour: {
              score: 1,
              missed: 0,
              incomplete: true,
            },
            agreement_30day: {
              score: 1,
              missed: 0,
              incomplete: true,
            },
            updated: '2020-05-28T09:21:19.188Z',
            domain: 'digifin.uk',
          }}
          width={width}
        />
      </Router>
    );

  it('renders simple tab information', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.simple-body-validator').length).toBe(1);
    expect(wrapper.find('a').length).toBe(2);
    const index = wrapper.find('.index');
    expect(index.length).toBe(1);
    expect(index.contains(<div className="title">Last Ledger formatted_date</div>)).toBe(true);
    expect(index.contains(<div className="title">Last ledger_index</div>)).toBe(true);
    wrapper.unmount();
  });

  it('renders index row instead of index cart in width smaller than 900', () => {
    const wrapper = createWrapper(800);
    expect(wrapper.find('.simple-body-validator').length).toBe(1);
    const index = wrapper.find('.index');
    expect(index.length).toBe(0);
    wrapper.unmount();
  });
});
