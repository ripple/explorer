import { cleanup, screen } from '@testing-library/react'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import offerCancel from './mock_data/OfferCancel.json'

const renderComponent = createDescriptionRenderFactory(Description)

describe('OfferCancel: Description', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(offerCancel)

    expect(screen.find('[data-testid="cancel-line"]')).toHaveText(
      'offer_cancel_description15239384',
    )
  })
})
