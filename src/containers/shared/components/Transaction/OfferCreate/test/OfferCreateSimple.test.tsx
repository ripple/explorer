import { Simple } from '../Simple'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('OfferCreate: Simple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockOfferCreateWithCancel)
    expect(wrapper.find('[data-test="cancel-id"] .value')).toHaveText(
      '#44866443',
    )
    expect(wrapper.find('[data-test="amount-buy"] .value')).toHaveText(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    expect(wrapper.find('[data-test="amount-sell"] .value')).toHaveText(
      `\uE9001,764.293151 XRP`,
    )
    wrapper.unmount()
  })

  it('renders', () => {
    const wrapper = createWrapper(mockOfferCreate)

    expect(wrapper.find('[data-test="offer-id"] .value')).not.toExist()
    expect(wrapper.find('[data-test="amount-buy"] .value')).toHaveText(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
    expect(wrapper.find('[data-test="amount-sell"] .value')).toHaveText(
      `\uE90024,755.081083 XRP`,
    )
  })
})
