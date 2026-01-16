import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import offerCancel from './mock_data/OfferCancel.json'

const renderComponent = createDescriptionRenderFactory(Description)

describe('OfferCancel: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(offerCancel)

    expect(container.querySelector('[data-testid="cancel-line"]')).toHaveTextContent(
      'offer_cancel_description15239384',
    )
  })
})
