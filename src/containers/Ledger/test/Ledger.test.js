import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import mockLedger from './storedLedger.json';
import i18n from '../../../i18nTestConfig';
import { initialState } from '../../../rootReducer';
import { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } from '../../shared/utils';
import Ledger from '../index';

describe('Ledger container', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <Ledger
              match={{ params: { identifier: '38079857' } }}
              updateContext={(rippledUrl, urlLink) => {}}
            />
          </Router>
        </Provider>
      </I18nextProvider>
    );
  };

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders loading', () => {
    const state = { ...initialState };
    state.ledger.data = {};
    state.ledger.loading = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.loader').length).toBe(1);
    wrapper.unmount();
  });

  it('renders ledger navbar', () => {
    const state = { ...initialState };
    state.ledger.data = mockLedger;
    state.ledger.loading = false;
    state.ledger.error = false;
    const wrapper = createWrapper(state);
    const header = wrapper.find('.ledger-header');
    expect(header.length).toBe(1);
    expect(header.find('.ledger-nav').length).toBe(1);
    expect(header.find('.ledger-nav a').length).toBe(2);
    wrapper.unmount();
  });

  it('renders ledger summary', () => {
    const state = { ...initialState };
    state.ledger.data = mockLedger;
    state.ledger.loading = false;
    state.ledger.error = false;
    const wrapper = createWrapper(state);
    const summary = wrapper.find('.ledger-header .ledger-info');

    expect(summary.length).toBe(1);
    expect(summary.find('.ledger-cols').length).toBe(1);
    expect(summary.find('.ledger-col').length).toBe(3);
    expect(summary.find('.ledger-index').length).toBe(1);
    expect(summary.find('.closed-date').length).toBe(1);
    expect(summary.find('.ledger-hash').length).toBe(1);

    wrapper.unmount();
  });

  it('renders transaction table header', () => {
    const state = { ...initialState };
    state.ledger.data = mockLedger;
    state.ledger.loading = false;
    state.ledger.error = false;
    const wrapper = createWrapper(state);
    const table = wrapper.find('.trans-table');
    expect(table.length).toBe(1);
    expect(table.find('.trans-header').length).toBe(1);
    expect(table.find('.trans-header .col-type').length).toBe(1);
    expect(table.find('.trans-header .col-account').length).toBe(1);
    wrapper.unmount();
  });

  it('renders all transactions', () => {
    const state = { ...initialState };
    state.ledger.data = mockLedger;
    state.ledger.loading = false;
    state.ledger.error = false;
    const wrapper = createWrapper(state);
    const table = wrapper.find('.trans-table');
    expect(table.length).toBe(1);
    expect(table.find('a.trans-row').length).toBe(mockLedger.transactions.length);
    wrapper.unmount();
  });

  it('renders 404 page on no match', () => {
    const state = { ...initialState };
    state.ledger.data = { error: NOT_FOUND, id: 1 };
    state.ledger.loading = false;
    state.ledger.error = true;

    const wrapper = createWrapper(state);
    expect(wrapper.find('.no-match .title').text()).toEqual('ledger_not_found');
    wrapper.unmount();
  });

  it('renders server error', () => {
    const state = { ...initialState };
    state.ledger.data = { error: SERVER_ERROR, id: 1 };
    state.ledger.loading = false;
    state.ledger.error = true;

    const wrapper = createWrapper(state);
    expect(wrapper.find('.no-match .title').text()).toEqual('generic_error');
    wrapper.unmount();
  });

  it('renders invalid id error', () => {
    const state = { ...initialState };
    state.ledger.data = { error: BAD_REQUEST, id: 'zzzz' };
    state.ledger.loading = false;

    const wrapper = createWrapper(state);
    expect(wrapper.find('.no-match .title').text()).toEqual('invalid_ledger_id');
    wrapper.unmount();
  });
});
