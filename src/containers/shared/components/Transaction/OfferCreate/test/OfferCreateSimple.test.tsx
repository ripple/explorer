import { Simple } from '../Simple'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const createWrapper = createSimpleRenderFactory(Simple)

describe('OfferCreate: Simple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockOfferCreateWithCancel)
    expect(wrapper.find('[data-testid="amount"] .one-line')).toHaveText(
      '\uE900 XRP/CSC.rCSC',
    )
    expect(wrapper.find('[data-testid="cancel-id"] .value')).toHaveText(
      '#44866443',
    )
    expect(wrapper.find('[data-testid="amount-buy"] .value')).toHaveText(
      `\uE9001,764.293151 XRP`,
    )
    expect(wrapper.find('[data-testid="amount-sell"] .value')).toHaveText(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    wrapper.unmount()
  })

  it('renders', () => {
    const wrapper = createWrapper(mockOfferCreate)

    expect(wrapper.find('[data-testid="offer-id"] .value')).not.toExist()
    expect(wrapper.find('[data-testid="amount-buy"] .value')).toHaveText(
      `\uE90024,755.081083 XRP`,
    )
    expect(wrapper.find('[data-testid="amount-sell"] .value')).toHaveText(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
  })
})
