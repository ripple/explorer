import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { initialState } from '../../../rootReducer';
import i18n from '../../../i18nTestConfig';
import Header from '../index';

describe('Header component', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (state = {}) => {
    const store = mockStore({ ...initialState, ...state });
    return mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <Provider store={store}>
            <Header />
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
    expect(wrapper.find('.search').length).toEqual(2);
    expect(wrapper.find('.logo').length).toEqual(2);
    expect(wrapper.find('.mobile-menu').length).toEqual(1);
    wrapper.unmount();
  });

  describe('Sidechain version', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV, REACT_APP_ENVIRONMENT: 'sidechain' };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('renders without crashing', () => {
      const wrapper = createWrapper();
      wrapper.unmount();
    });

    it('renders all parts', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.search').length).toEqual(2);
      expect(wrapper.find('.logo').length).toEqual(2);
      expect(wrapper.find('.mobile-menu').length).toEqual(1);
      wrapper.unmount();
    });
  });
});
