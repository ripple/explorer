import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import offerCancel from './mock_data/OfferCancel.json'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('OfferCancel: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(offerCancel)

    expect(wrapper.find('[data-test="cancel-line"]')).toHaveText(
      'offer_cancel_description15239384',
    )
  })
})
