import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { BAD_REQUEST } from '../../shared/utils';
import i18n from '../../../i18nTestConfig';
import { initialState } from '../../../rootReducer';
import Validator from '../index';

global.location = '/validators/aaaa';

describe('Validator container', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <Validator
              match={{
                params: { identifier: 'mock-validator-hash' },
                path: '/validators/:identifier/:tab?',
              }}
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
    state.validator.data = {};
    state.validator.loading = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.loader').length).toBe(1);
    wrapper.unmount();
  });

  it('sets title to domain', () => {
    const state = { ...initialState };
    state.validator.data = {
      domain: 'example.com',
    };
    const wrapper = createWrapper(state);
    expect(document.title).toBe('Validator example.com | xrpl_explorer');
    wrapper.unmount();
  });

  it('sets title to master_key', () => {
    const state = { ...initialState };
    state.validator.data = {
      master_key: 'foo',
    };
    const wrapper = createWrapper(state);
    expect(document.title).toBe('Validator foo... | xrpl_explorer');
    wrapper.unmount();
  });

  it('sets title to signing_key', () => {
    const state = { ...initialState };
    state.validator.data = {
      signing_key: 'bar',
    };
    const wrapper = createWrapper(state);
    expect(document.title).toBe('Validator bar... | xrpl_explorer');
    wrapper.unmount();
  });

  it('renders 404 page on no match', () => {
    const state = { ...initialState };
    state.validator.data = { error: BAD_REQUEST };
    state.validator.loading = false;
    state.validator.error = true;
    const wrapper = createWrapper(state);
    expect(wrapper.find('.no-match').length).toBe(1);
    wrapper.unmount();
  });
});
