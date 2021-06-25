import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import i18n from '../../../../i18nTestConfig';
import TokensFooter from '../index';

const createWrapper = (isLoading = false, isError = false, updated = 1620793517865) => {
  return mount(
    <I18nextProvider i18n={i18n}>
      <Router>
        <TokensFooter
          isLoading={isLoading}
          isError={isError}
          updated={isLoading || isError ? undefined : updated}
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
    // moxios.uninstall();
    wrapper.unmount();
  });

  it('renders without crashing', () => {
    const tokensFooterNode = wrapper.find('.tokens-footer-container');
    expect(tokensFooterNode.length).toEqual(1);
  });

  it('renders the disclaimer', () => {
    const disclaimerNode = wrapper.find('.disclaimer');
    expect(disclaimerNode.length).toEqual(1);
  });

  it('renders the updated time', () => {
    const lastUpdatedNode = wrapper.find('.last-update');
    expect(lastUpdatedNode.length).toEqual(1);
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
  let realDateNow;

  beforeEach(() => {
    realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => 1620795517865);
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    global.Date.now = realDateNow;
  });

  it('loads the last updated time on successful request', async () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <TokensFooter isLoading={false} updated={1620793517865} />
        </Router>
      </I18nextProvider>
    );

    // https://stackoverflow.com/questions/57006369/testing-asynchronous-useeffect
    await act(async () => {
      wrapper.update();
    });

    const lastUpdatedTime = wrapper.find('.last-update');
    const expectedUpdatedTime = 'Last updated 33 minutes ago';

    // Calculate the expected total issuers based on the 'data' constant above
    expect(lastUpdatedTime.text()).toEqual(expectedUpdatedTime);
  });

  it('handles updated error', async () => {
    // Simulating an error in the http response (catch block)
    const wrapper = createWrapper(false, true, undefined);

    // https://stackoverflow.com/questions/57006369/testing-asynchronous-useeffect
    await act(async () => {
      wrapper.update();
    });

    const lastUpdatedTime = wrapper.find('.last-update');

    const errorValue = 'Last updated time unavailable';
    expect(lastUpdatedTime.text()).toEqual(errorValue);
  });
});
