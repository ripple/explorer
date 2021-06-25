import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import App from '../index';

describe('App container', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}, path = '/') => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <MemoryRouter initialEntries={[path]}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <App />
          </Provider>
        </I18nextProvider>
      </MemoryRouter>
    );
  };

  it('renders main parts', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.header').length).toBe(1);
    expect(wrapper.find('.content').length).toBe(1);
    expect(wrapper.find('.footer').length).toBe(1);
    wrapper.unmount();
  });

  it('renders home', () => {
    const wrapper = createWrapper();
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers');
      expect(wrapper.find('.ledgers').length).toBe(1);
      wrapper.unmount();
    });
  });

  it('renders ledger explorer page', () => {
    const wrapper = createWrapper({}, '/ledgers');
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | ledgers');
      wrapper.unmount();
    });
  });

  it('renders not found page', () => {
    const wrapper = createWrapper({}, '/zzz');
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual('xrpl_explorer | 404_default_title');
      wrapper.unmount();
    });
  });

  it('renders ledger page', () => {
    const id = 12345;
    const wrapper = createWrapper({}, `/ledgers/${id}`);
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ledger ${id}`);
      wrapper.unmount();
    });
  });

  it('renders transaction page', () => {
    const id = 12345;
    const wrapper = createWrapper({}, `/transactions/${id}`);
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | transaction_short ${id}...`);
      wrapper.unmount();
    });
  });

  it('renders account page', () => {
    const id = 'rZaChweF5oXn';
    const wrapper = createWrapper({}, `/accounts/${id}#ssss`);
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`);
      wrapper.unmount();
    });
  });

  it('redirects legacy transactions page', () => {
    const id = 12345;
    const wrapper = createWrapper({}, `/#/transactions/${id}`);
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | transaction_short ${id}...`);
      wrapper.unmount();
    });
  });

  it('redirects legacy account page', () => {
    const id = 'rZaChweF5oXn';
    const wrapper = createWrapper({}, `/#/graph/${id}#ssss`);
    return new Promise(r => setTimeout(r, 200)).then(() => {
      expect(document.title).toEqual(`xrpl_explorer | ${id}...`);
      wrapper.unmount();
    });
  });
});
