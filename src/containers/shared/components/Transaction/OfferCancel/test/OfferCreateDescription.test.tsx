import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import offerCancel from './mock_data/OfferCancel.json'

const createWrapper = createDescriptionRenderFactory(Description)

describe('OfferCancel: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(offerCancel)

    expect(wrapper.find('[data-testid="cancel-line"]')).toHaveText(
      'offer_cancel_description15239384',
    )
  })
})
