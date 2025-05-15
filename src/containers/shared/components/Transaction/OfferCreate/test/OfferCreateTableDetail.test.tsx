import { TableDetail } from '../TableDetail'
import mockOfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import { createTableDetailWrapperFactory } from '../../test'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('OfferCreate: TableDetail', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockOfferCreateWithCancel)

    expect(wrapper.find('[data-testid="pair"]')).toHaveText(
      'price:612.518 \uE900 XRP/CSC.rCSC',
    )
    expect(wrapper.find('[data-testid="cancel-id"]')).toHaveText(
      'cancel_offer #44866443',
    )
    expect(wrapper.find('[data-testid="amount-buy"]')).toHaveText(
      `\uE9001,764.293151 XRP`,
    )
    expect(wrapper.find('[data-testid="amount-sell"]')).toHaveText(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    wrapper.unmount()
  })

  it('renders', () => {
    const wrapper = createWrapper(mockOfferCreate)

    expect(wrapper.find('[data-testid="pair"]')).toHaveText(
      'price:0.00207696 \uE900 XRP/BCH.rcyS',
    )
    expect(wrapper.find('[data-testid="offer-id"]')).not.toExist()
    expect(wrapper.find('[data-testid="amount-buy"]')).toHaveText(
      `\uE90024,755.081083 XRP`,
    )
    expect(wrapper.find('[data-testid="amount-sell"]')).toHaveText(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
  })

  it('renders inverted currencies', () => {
    const wrapper = createWrapper(mockOfferCreateInvertedCurrencies)

    expect(wrapper.find('[data-testid="pair"]')).toHaveText(
      'price:0.346896 \uE900 XRP/USD.rvYA',
    )
  })
})
