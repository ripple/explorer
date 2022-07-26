import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n from '../../../../i18nTestConfig';
import TokensTable from '../index';

describe('The page', () => {
  let wrapper;

  const createWrapper = () => mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <TokensTable allTokens={[]} isError={false} />
        </Router>
      </I18nextProvider>
    );

  beforeEach(async () => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders without crashing', () => {
    const tokensTableNode = wrapper.find('.tokens-table-container');
    expect(tokensTableNode.length).toEqual(1);
  });

  it('renders the table', () => {
    const tableNode = wrapper.find('.tokens-table');
    expect(tableNode.length).toEqual(1);
  });

  describe('While fetching data', () => {
    it('renders the Loader first', () => {
      const loader = wrapper.find('Loader');
      expect(loader).toExist();
    });
  });
});
