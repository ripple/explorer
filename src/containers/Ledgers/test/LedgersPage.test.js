import React from 'react';
import { mount } from 'enzyme';
import moxios from 'moxios';
import WS from 'jest-websocket-mock';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18nTestConfig';
import Ledgers from '../index';
import ledgerMessage from './mock/ledger.json';
import validationMessage from './mock/validation.json';
import { initialState } from '../../../rootReducer';
import prevLedgerMessage from './mock/prevLedger.json';
import moxiosData from './mock/rippled.json';

class MockResponse {
  constructor() {
    this.iterations = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get response() {
    const request = moxios.requests.mostRecent();
    const postParams = JSON.parse(request.config.data);
    const { method } = postParams.options;
    return moxiosData[method];
  }

  // eslint-disable-next-line class-methods-use-this
  get status() {
    return 200;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Ledgers Page container', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const createWrapper = (props = {}) => {
    const store = mockStore({ ...initialState });

    return mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <Ledgers msg={props.msg} />
          </Provider>
        </I18nextProvider>
      </Router>
    );
  };

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
  });

  it('renders all parts', () => {
    moxios.stubRequest(`/api/v1/validators`, {
      status: 200,
      response: [],
    });

    const wrapper = createWrapper();
    expect(wrapper.find('.ledgers').length).toBe(1);
    wrapper.unmount();
  });

  test('receives messages from streams', async () => {
    const server = new WS(
      `wss://${process.env.REACT_APP_RIPPLED_HOST}:${process.env.REACT_APP_RIPPLED_WS_PORT}`,
      { jsonProtocol: true }
    );
    const wrapper = createWrapper();

    moxios.stubRequest(`/api/v1/validators`, {
      status: 200,
      response: [
        {
          signing_key: 'n9M2anhK2HzFFiJZRoGKhyLpkh55ZdeWw8YyGgvkzY7AkBvz5Vyj',
          master_key: 'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
          unl: process.env.REACT_APP_VALIDATOR,
        },
        {
          signing_key: 'n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR',
          master_key: 'nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec',
          unl: process.env.REACT_APP_VALIDATOR,
        },
        {
          signing_key: 'n9K7Wfxgyqw4XSQ1BaiKPHKxw2D9BiBiseyn7Ldg7KieQZJfrPf4',
          master_key: 'nHUkhmyFPr3vEN3C8yfhKp4pu4t3wkTCi2KEDBWhyMNpsMj2HbnD',
          unl: null,
        },
      ],
    });

    moxios.stubRequest(`/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`, new MockResponse());

    expect(wrapper.find('.ledger').length).toBe(0);
    expect(wrapper.find('.validation').length).toBe(0);
    expect(wrapper.find('.txn').length).toBe(0);

    await server.connected;
    server.send(prevLedgerMessage);
    await sleep(260);
    server.send(validationMessage);
    server.send(ledgerMessage);
    server.send({ type: 'invalid' });
    server.send(null);

    wrapper.update();
    expect(wrapper.find('.ledger').length).toBe(2);
    expect(wrapper.find('.selected-validator .pubkey').length).toBe(0);
    expect(wrapper.find('.tooltip').length).toBe(0);

    const unlCounter = wrapper.find('.ledger .hash .missed');
    expect(unlCounter.text()).toBe('unl:1/2');
    unlCounter.simulate('mouseMove');
    expect(wrapper.find('.tooltip').length).toBe(1);
    expect(wrapper.find('.tooltip .pubkey').text()).toBe(
      'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ'
    );

    // async update ledger summary due
    // to throttle and purge/heartbeat delay
    setTimeout(() => {
      wrapper.update();

      const validations = wrapper.find('div.validation');
      const txn = wrapper.find('.txn');

      // check ledger transactions
      expect(txn.length).toBe(24);
      txn.first().simulate('focus');
      txn.first().simulate('mouseOver');

      // check validations
      expect(validations.length).toBe(1);
      validations.first().simulate('mouseOver');
      expect(wrapper.find('.tooltip').length).toBe(1);
      validations.first().simulate('mouseLeave');
      expect(wrapper.find('.tooltip').length).toBe(0);
      validations.first().simulate('focus');
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(0);
      validations.first().simulate('click'); // set selected
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(1);
      validations.first().simulate('click'); // unset selected
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(0);

      setTimeout(() => {
        wrapper.unmount();
      }, 6000);
    }, 300);
  }, 8000);
});
