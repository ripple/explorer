import OfferCreate from './mock_data/OfferCreateWithExpirationAndCancel.json'
import OfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import OfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('OfferCreate: Description', () => {
  it('renders description for transaction with cancel and expiration', () => {
    const wrapper = createWrapper(OfferCreate)

    expect(wrapper.html()).toBe(
      '<div>The account<a data-testid="account" title="rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe" class="account" href="/accounts/rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe">rETx8GBiH6fxhTcfHM9fGeyShqxozyD3xe</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">1,080,661.95882</span> <a data-testid="currency" class="currency" href="/token/CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr">CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr</a></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">1,764.293151</span> <span class="currency" data-testid="currency">XRP</span></span></b></div><div>offer_create_desc_line_2<b><span> 612.52</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr">CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr</a></small></b></div><div>offer_create_desc_line_3<b> 44866443</b></div>The offer expires<span class="time">May 18, 2022 at 5:28:16 PM UTC</span>unless cancelled before',
    )
    wrapper.unmount()
  })

  it('renders description for transaction with inverted currencies', () => {
    const wrapper = createWrapper(OfferCreateInvertedCurrencies)

    expect(wrapper.html()).toBe(
      '<div>The account<a data-testid="account" title="rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG" class="account" href="/accounts/rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG">rXTZ5g8X7mrAYEe7iFeM9fiS4ccueyurG</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">17,588.363594</span> <span class="currency" data-testid="currency">XRP</span></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">$6,101.33033905</span> <a data-testid="currency" class="currency" href="/token/USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B">USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B</a></span></b></div><div>offer_create_desc_line_2<b><span> 0.34690</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B">USD.rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B</a></small></b></div><div>offer_create_desc_line_3<b> 80543309</b></div>',
    )
    wrapper.unmount()
  })

  it('renders description for transaction with Permissioned Domain ID', () => {
    const wrapper = createWrapper(OfferCreateWithPermissionedDomainID)

    expect(wrapper.html()).toBe(
      '<div>The account<a data-testid="account" title="rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds" class="account" href="/accounts/rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds">rD7ShWxq6xRYWDSDfzhKbfaJDerxd7nnds</a>offered to pay<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">17,588.363594</span> <span class="currency" data-testid="currency">XRP</span></span></b>in order to receive<b><span class="amount" data-testid="amount"><span class="amount-localized" data-testid="amount-localized">$10.00</span> <a data-testid="currency" class="currency" href="/token/USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC">USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC</a></span></b></div><div>offer_create_desc_line_2<b><span> 0.00056856</span><small><span class="currency" data-testid="currency">XRP</span>/<a data-testid="currency" class="currency" href="/token/USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC">USD.rnybsH3BZKKCG7fwPzTeLtGejnq6UQyNCC</a></small></b></div><div>offer_create_desc_line_5<b>: 4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812</b></div>',
    )
    wrapper.unmount()
  })
})
