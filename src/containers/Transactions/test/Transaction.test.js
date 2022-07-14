import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { BAD_REQUEST } from '../../shared/utils';
import mockTransaction from './mock_data/Transaction.json';
import mockTransactionSummary from './mock_data/TransactionSummary.json';
import i18n from '../../../i18nTestConfig';
import { initialState } from '../../../rootReducer';
import Transaction from '../index';

global.location = '/transactions/aaaa';

describe('Transaction container', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}, tab = 'simple') => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router initialEntries={[`/transactions/${mockTransaction.hash}/${tab}`]}>
            <Route path="/transactions/:identifier/:tab?" component={Transaction} />
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
    state.transaction.data = {};
    state.transaction.loading = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.loader').length).toBe(1);
    wrapper.unmount();
  });

  it('renders 404 page on no match', () => {
    const state = { ...initialState };
    state.transaction.data = { error: BAD_REQUEST };
    state.transaction.loading = false;
    state.transaction.error = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.no-match').length).toBe(1);
    wrapper.unmount();
  });

  it('renders summary section', () => {
    const state = { ...initialState };
    state.transaction.data = { raw: mockTransaction, summary: mockTransactionSummary };
    state.transaction.loading = false;
    state.transaction.error = false;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.transaction').length).toBe(1);
    const summary = wrapper.find('.summary');
    expect(summary.length).toBe(1);
    expect(summary.contains(<div className="type">OfferCreate</div>)).toBe(true);
    expect(
      summary.contains(
        <div className="hash" title={mockTransaction.hash}>
          {mockTransaction.hash}
        </div>
      )
    ).toBe(true);
    expect(
      summary.contains(
        <div className="status success">
          <img src="success.png" alt="success" />
          success
        </div>
      )
    ).toBe(true);
    wrapper.unmount();
  });

  it('renders tabs', () => {
    const state = { ...initialState };
    state.transaction.data = { raw: mockTransaction, summary: mockTransactionSummary };
    const wrapper = createWrapper(state);
    expect(wrapper.find('.tabs').length).toBe(1);
    expect(wrapper.find('a.tab').length).toBe(3);
    expect(
      wrapper
        .find('a.tab')
        .at(0)
        .props().title
    ).toBe('simple');
    expect(
      wrapper
        .find('a.tab')
        .at(1)
        .props().title
    ).toBe('detailed');
    expect(
      wrapper
        .find('a.tab')
        .at(2)
        .props().title
    ).toBe('raw');
    expect(wrapper.find('a.tab.selected').text()).toEqual('simple');
    expect(wrapper.find('.simple-body-tx').length).toBe(1);
  });

  it('renders detailed tab', () => {
    const state = { ...initialState };
    state.transaction.data = { raw: mockTransaction, summary: mockTransactionSummary };
    const wrapper = createWrapper(state, 'detailed');
    expect(wrapper.find('a.tab.selected').text()).toEqual('detailed');
    expect(wrapper.find('.detail-body').length).toBe(1);
    wrapper.unmount();
  });

  it('renders raw tab', () => {
    const state = { ...initialState };
    state.transaction.data = { raw: mockTransaction, summary: mockTransactionSummary };
    const wrapper = createWrapper(state, 'raw');
    expect(wrapper.find('a.tab.selected').text()).toEqual('raw');
    expect(wrapper.find('.react-json-view').length).toBe(1);
    wrapper.unmount();
  });
});
