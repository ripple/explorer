import OfferCreate from './mock_data/OfferCreateWithExpirationAndCancel.json'
import OfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('OfferCreate: Description', () => {
  it('renders description for transaction with cancel and expiration', () => {
    const wrapper = createWrapper(OfferCreate)

    expect(wrapper.html()).toBe(
      '<div>The account<a data-testid="account" title="rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe" class="account" href="/accounts/rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe">rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe</a>offered to pay<b>1,080,661.95882<small>CSC</small></b>in order to receive<b>\uE9001,764.293151<small>XRP</small></b></div><div>offer_create_desc_line_2<b><span> 612.52</span><small>XRP/CSC</small></b></div><div>offer_create_desc_line_3<b> 44866443</b></div>The offer expires<span class="time">May 18, 2022 at 5:28:16 PM UTC</span>unless cancelled before',
    )
    wrapper.unmount()
  })

  it('renders description for transaction with inverted currencies', () => {
    const wrapper = createWrapper(OfferCreateInvertedCurrencies)

    expect(wrapper.html()).toBe(
      '<div>The account<a data-testid="account" title="rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG" class="account" href="/accounts/rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG">rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG</a>offered to pay<b>\uE90017,588.363594<small>XRP</small></b>in order to receive<b>$6,101.33033905<small>USD</small></b></div><div>offer_create_desc_line_2<b><span> 0.34690</span><small>XRP/USD</small></b></div><div>offer_create_desc_line_3<b> 80543309</b></div>',
    )
    wrapper.unmount()
  })
})
