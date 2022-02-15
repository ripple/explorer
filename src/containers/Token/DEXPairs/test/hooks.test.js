import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import moxios from 'moxios';
import i18n from '../../../../i18nTestConfig';
import DEXPairs from '../index';
import mockTopEndpoint from './mockTopEndpoint.json';
import mockExchangeData from './mockExchangeData.json';
import BaseMockResponse from '../../../test/mockRippledResponse';

const address = 'rHEQnRvqWccQALFfpG3YuoxxVyhDZnF4TS';
const currency = 'USD';

class MockResponse extends BaseMockResponse {
  constructor(moxiosData, shouldRender) {
    super(moxiosData);
    this.shouldRender = shouldRender;
  }

  // eslint-disable-next-line class-methods-use-this
  get response() {
    if (!this.shouldRender) {
      return { message: 'Bad Request' };
    }
    const request = moxios.requests.mostRecent();
    const postParams = JSON.parse(request.config.data);
    const { taker_pays: takerPays } = postParams.options.params[0];
    const token = `${takerPays.currency}.${takerPays.issuer}`;
    const tokenName = takerPays.currency === 'XRP' ? 'XRP' : token;
    return this.moxiosData[tokenName];
  }

  get status() {
    return this.shouldRender ? 200 : 400;
  }
}

describe('Testing hooks', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const setupPage = async (shouldRender = true) => {
    const topUrl = '/api/v1/token/top';

    moxios.stubRequest(topUrl, {
      status: shouldRender ? 200 : 400,
      response: shouldRender ? mockTopEndpoint : { message: 'Bad Request' },
    });

    moxios.stubRequest(
      `/api/v1/cors/${process.env.REACT_APP_RIPPLED_HOST}`,
      new MockResponse(mockExchangeData, shouldRender)
    );

    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <DEXPairs accountId={address} currency={currency} />
      </I18nextProvider>
    );

    return wrapper;
  };

  describe('renders DEXPairs table', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await setupPage(true);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('renders all pairs', done => {
      setImmediate(() => {
        wrapper.update();
        const allPairs = wrapper.find('.pair');
        // 3 from the mockTopEndpoint and 3 from hardcoded pairs
        expect(allPairs.length).toEqual(6);
        done();
      });
    });
    it('renders all PairStats components', done => {
      setImmediate(() => {
        wrapper.update();
        const allLows = wrapper.find('.low');
        const allHighs = wrapper.find('.high');
        expect(allLows.length).toEqual(12);
        expect(allHighs.length).toEqual(12);
        done();
      });
    });
  });

  describe('renders on top tokens endpoint failure', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await setupPage(false);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('renders on top tokens failure', done => {
      // setImmediate will execute the callback immediately after all queued promise callbacks are executed
      setImmediate(() => {
        wrapper.update();
        const noTokensNode = wrapper.find('.no-pairs-message');
        expect(noTokensNode.length).toEqual(1);
        done();
      });
    });
  });
});
