import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import NFTokenCancelOffer from '../NFTokenCancelOffer';
import transaction from '../../test/mock_data/NFTokenCancelOffer.json';
import summarizeTransaction from '../../../../rippled/lib/txSummary';

describe('NFTokenCancelOffer', () => {
  it('handles NFTokenCancelOffer simple view ', () => {
    const wrapper = mount(<Router><NFTokenCancelOffer data={summarizeTransaction(transaction, true).details} /></Router>);
    expect(wrapper.find('[data-test="token-id"]')).toHaveText('000800006203F49C21D5D6E022CB16DE3538F248662FC73C258BA1B200000018');
    expect(wrapper.find('[data-test="offer-id"]')).toHaveText('35F3D6D99548FA5F5315580FBF8BA6B15CAA2CAE93023D5CE4FDC130602BC5C3');
    expect(wrapper.find('[data-test="amount"]')).toHaveText('100USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g');
    expect(wrapper.find('[data-test="offerer"]')).toHaveText('r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g');
    wrapper.unmount();
  });
});
