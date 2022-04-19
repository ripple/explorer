import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import i18n from '../../../../i18nTestConfig';
import TokensHeader from '../index';

const createWrapper = (isLoading = false, isError = false, tokens = []) => {
  return mount(
    <I18nextProvider i18n={i18n}>
      <Router>
        <TokensHeader
          isLoading={isLoading}
          tokens={isLoading || isError ? [] : tokens}
          isError={isError}
        />
      </Router>
    </I18nextProvider>
  );
};

describe('The page', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders without crashing', () => {
    const tokensHeaderNode = wrapper.find('.tokens-header-container');
    expect(tokensHeaderNode.length).toEqual(1);
  });

  it('renders the title', () => {
    const titleNode = wrapper.find('.title');
    expect(titleNode.length).toEqual(1);
  });

  it('renders the total group', () => {
    const totalGroupNode = wrapper.find('.total-group');
    expect(totalGroupNode.length).toEqual(1);
  });

  it('renders two labels', () => {
    const labelsNodes = wrapper.find('.label');
    expect(labelsNodes.length).toEqual(2);
  });

  it('renders two total values', () => {
    const valuesNodes = wrapper.find('.value');
    expect(valuesNodes.length).toEqual(2);
  });

  describe('While fetching data', () => {
    beforeEach(async () => {
      wrapper = createWrapper(true);
    });

    // unmounting handled by above `afterEach`

    it('renders the Loader first', () => {
      const loader = wrapper.find('Loader');
      expect(loader).toExist();
    });
  });
});

describe('Testing hooks', () => {
  const tokens = [
    {
      issuer: '1234',
      currency: 'BTC',
      obligations: 111943486997895,
      trustlines: 152625,
    },
    {
      issuer: '4321',
      currency: 'ETH',
      obligations: 21196997895.66,
      trustlines: 132635,
    },
    {
      issuer: '1234',
      currency: 'USD',
      obligations: 21196997895.66,
      trustlines: 132635,
    },
    {
      issuer: 'abcd',
      currency: 'BTC',
      obligations: 21196997895.66,
      trustlines: 132635,
    },
  ];

  it('loads the total issuers and tokens on successful request', async () => {
    const wrapper = createWrapper(false, false, tokens);
    // https://stackoverflow.com/questions/57006369/testing-asynchronous-useeffect
    await act(async () => {
      wrapper.update();
    });

    const totalIssuers = wrapper.find('.total-issuers-container .value');
    const totalTokens = wrapper.find('.total-tokens-container .value');

    // Calculate the expected total issuers based on the 'tokens' constant above
    const allIssuers = tokens.map(token => token.issuer);
    const expectedTotalIssuers = new Set(allIssuers).size;

    expect(totalIssuers.text()).toEqual(expectedTotalIssuers.toString());
    expect(totalTokens.text()).toEqual(tokens.length.toString());
  });

  it('handles the http request error', async () => {
    const wrapper = createWrapper(false, true, []);

    // https://stackoverflow.com/questions/57006369/testing-asynchronous-useeffect
    await act(async () => {
      wrapper.update();
    });

    const totalIssuers = wrapper.find('.total-issuers-container .value');
    const totalTokens = wrapper.find('.total-tokens-container .value');

    const errorValue = 'N/A';
    expect(totalIssuers.text()).toEqual(errorValue);
    expect(totalTokens.text()).toEqual(errorValue);
  });
});
