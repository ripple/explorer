import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import NFTokenCreateOffer from '../NFTokenCreateOffer';
import transactionBuy from '../../test/mock_data/NFTokenCreateOffer_Buy.json';
import transactionSell from '../../test/mock_data/NFTokenCreateOffer_Sell.json';
import summarizeTransaction from '../../../../rippled/lib/txSummary';

describe('NFTokenCreateOffer', () => {
  it('handles NFTokenCreateOffer buy simple view ', () => {
    const wrapper = mount(
      <Router>
        <NFTokenCreateOffer data={summarizeTransaction(transactionBuy, true).details} />
      </Router>
    );
    expect(wrapper.find('[data-test="token-id"]')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C2DCBAB9D00000002'
    );
    expect(wrapper.find('[data-test="offer-id"]')).toHaveText(
      '3D1C297DA5B831267CCF692F8A023688D6A4BD5AFAE9A746D5C4E0B15D256B29'
    );
    expect(wrapper.find('[data-test="owner"]')).toHaveText('r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g');
    expect(wrapper.find('[data-test="amount"]')).toHaveText('0.0001XRP');
    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText('Buyer');
    expect(wrapper.find('[data-test="buyer-or-seller"] .account.value')).toHaveText(
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh'
    );
    wrapper.unmount();
  });

  it('handles NFTokenCreateOffer sell simple view ', () => {
    const wrapper = mount(
      <Router>
        <NFTokenCreateOffer data={summarizeTransaction(transactionSell, true).details} />
      </Router>
    );
    expect(wrapper.find('[data-test="token-id"]')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D'
    );
    expect(wrapper.find('[data-test="offer-id"]')).toHaveText(
      'F660CA62E16B8067649052E8FCE947049FC6EF0D8B42EF7E5819997EC5AE45B6'
    );
    expect(wrapper.find('[data-test="owner"]')).not.toExist();
    expect(wrapper.find('[data-test="amount"]')).toHaveText(
      '100USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g'
    );
    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText('Seller');
    expect(wrapper.find('[data-test="buyer-or-seller"] .account.value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g'
    );
    wrapper.unmount();
  });
});
