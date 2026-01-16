import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import offerCancel from './mock_data/OfferCancel.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('OfferCancel: Simple', () => {
  it('renders', () => {
    const { container } = renderComponent(offerCancel)

    expectSimpleRowText(container, 'cancel', '#15239384')
  })
})
