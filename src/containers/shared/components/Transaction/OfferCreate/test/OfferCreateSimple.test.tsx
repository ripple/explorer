import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { OfferCreateSimple } from '../OfferCreateSimple';
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json';
import mockOfferCreate from './mock_data/OfferCreate.json';
import summarizeTransaction from '../../../../../../rippled/lib/txSummary';
import i18n from '../../../../../../i18nTestConfig';

function createWrapper(tx: any) {
  const data = summarizeTransaction(tx, true);
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <OfferCreateSimple data={data.details} />
      </BrowserRouter>
    </I18nextProvider>
  );
}

describe('OfferCreateSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockOfferCreateWithCancel);
    expect(wrapper.find('[data-test="cancel-id"]')).toHaveText('#44866443');
    expect(wrapper.find('[data-test="amount-buy"]')).toHaveText(
      `1,080,661.95882CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`
    );
    expect(wrapper.find('[data-test="amount-sell"]')).toHaveText(`1,764.293151XRP`);
    wrapper.unmount();
  });

  it('renders', () => {
    const wrapper = createWrapper(mockOfferCreate);

    expect(wrapper.find('[data-test="offer-id"]')).not.toExist();
    expect(wrapper.find('[data-test="amount-buy"]')).toHaveText(
      `51.41523894BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`
    );
    expect(wrapper.find('[data-test="amount-sell"]')).toHaveText(`24,755.081083XRP`);
  });
});
