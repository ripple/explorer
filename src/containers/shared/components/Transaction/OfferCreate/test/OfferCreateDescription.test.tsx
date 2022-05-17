import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import i18n from '../../../../../../i18nTestConfig';
import OfferCreate from './mock_data/OfferCreateWithExpirationAndCancel.json';
import { OfferCreateDescription } from '../OfferCreateDescription';

function createWrapper(tx: any) {
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <OfferCreateDescription data={tx} />
      </BrowserRouter>
    </I18nextProvider>
  );
}

describe('OfferCreateDescription', () => {
  it('renders description for transaction with cancel an expiration', () => {
    const wrapper = createWrapper(OfferCreate);

    expect(wrapper.html()).toBe(
      '<div>The account<a class="account" title="rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe" href="/accounts/rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe">rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe</a>offered to pay<b>1,080,661.95882<small>CSC</small></b>in order to receive<b>1,764.293151<small>XRP</small></b></div><div>offer_create_desc_line_2<b><span> 612.52</span><small>XRP/CSC</small></b></div><div>offer_create_desc_line_3<b> 44866443</b></div>The offer expires<span class="time">May 18, 2022, 5:28:16 PM UTC</span>unless cancelled before'
    );
    wrapper.unmount();
  });
});
