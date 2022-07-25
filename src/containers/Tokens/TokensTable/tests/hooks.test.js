import React from 'react';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import i18n from '../../../../i18nTestConfig';
import TokensTable from '../index';
import mockTopEndpoint from './mockTopEndpoint.json';
import expectedOutputData from './expectedOutputData.json';

const mountTable = (isError = false, allTokens = []) => mount(
    <I18nextProvider i18n={i18n}>
      <Router>
        <TokensTable isError={isError} allTokens={allTokens} />
      </Router>
    </I18nextProvider>
  );

describe('Testing hooks', () => {
  const setupPage = async (shouldRender = true) => {
    const wrapper = mountTable(!shouldRender, shouldRender ? mockTopEndpoint : []);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });

    return wrapper;
  };

  describe('renders the full page', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await setupPage(true);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    const checkRowComponent = (row, name, expectedValue) => {
      const node = row.find(`.${name}`);
      expect(node.length).toEqual(1);
      expect(node.text()).toEqual(expectedValue.toString());
    };

    it('renders the table structure', async () => {
      const tableNode = wrapper.find('.tokens-table table');
      expect(tableNode.length).toEqual(1);
      const tbodyNode = tableNode.find('tbody');
      expect(tbodyNode.length).toEqual(1);

      const allTableRowsNode = tbodyNode.find('tr');
      expect(allTableRowsNode.length).toEqual(11);

      const tableHeaderNode = tbodyNode.find('.tokens-table-header');
      expect(tableHeaderNode.length).toEqual(1);
      const tableContentNodes = tbodyNode.find('.tokens-table-row');
      expect(tableContentNodes.length).toEqual(10);
    });

    it('renders the correct table content', async () => {
      const tableContentNodes = wrapper.find('.tokens-table-row');
      const rows = tableContentNodes.map(x => x);
      for (let i = 0; i < mockTopEndpoint.length; i += 1) {
        const row = rows[i];
        const expected = expectedOutputData[i];
        checkRowComponent(row, 'rank', i + 1);
        checkRowComponent(row, 'token', expected.currency);
        checkRowComponent(row, 'issuer', expected.issuer); // TODO: check link too
        checkRowComponent(row, 'obligations', expected.obligations);
        checkRowComponent(row, 'volume', expected.volume);
        checkRowComponent(row, 'market-cap', `\uE900 ${expected.marketCap}`);
      }
    });
  });

  describe('renders on endpoint failure', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await setupPage(false);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('renders on failure', async () => {
      const noTokensNode = wrapper.find('.tokens-table .empty-tokens-message');
      expect(noTokensNode.length).toEqual(1);
    });
  });
});
