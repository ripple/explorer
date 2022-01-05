import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import Search from '../Search';

describe('Header component', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Provider store={store}>
            <Search />
          </Provider>
        </Router>
      </I18nextProvider>
    );
  };

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders all parts', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.search').length).toEqual(1);
    expect(wrapper.find('.search input').length).toEqual(1);
    expect(wrapper.find('.search input').prop('placeholder')).toEqual('header.search.placeholder');
    wrapper.unmount();
  });

  it('search ledger index', () => {
    const wrapper = createWrapper();
    const input = wrapper.find('.search input');
    const ledgerIndex = '123456789';
    const rippleAddress = 'rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX';
    const hash = '59239EA78084F6E2F288473F8AE02F3E6FC92F44BDE59668B5CAE361D3D32838';
    const token1 = 'cny.rJ1adrpGS3xsnQMb9Cw54tWJVFPuSdZHK';
    const token2 = '534f4c4f00000000000000000000000000000000.rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz';
    const invalidString = '123invalid';

    input.simulate('keyDown', { key: 'a' });
    expect(window.location.pathname).toEqual('/');

    input.instance().value = ledgerIndex;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/ledgers/${ledgerIndex}`);

    input.instance().value = rippleAddress;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/accounts/${rippleAddress}`);

    input.instance().value = hash;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/transactions/${hash}`);

    input.instance().value = token1;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/token/${token1}`);

    input.instance().value = token2;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/token/${token2}`);

    input.instance().value = invalidString;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/search/${invalidString}`);

    // ensure strings are trimmed
    input.instance().value = ` ${hash} `;
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/transactions/${hash}`);

    // handle lower case tx hash
    input.instance().value = hash.toLowerCase();
    input.simulate('keyDown', { key: 'Enter' });
    expect(window.location.pathname).toEqual(`/transactions/${hash}`);
    wrapper.unmount();
  });
});
