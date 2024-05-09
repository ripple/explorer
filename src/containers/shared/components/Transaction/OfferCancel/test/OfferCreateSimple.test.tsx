import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import offerCancel from './mock_data/OfferCancel.json'

const createWrapper = createSimpleRenderFactory(Simple)

describe('OfferCancel: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(offerCancel)

    expectSimpleRowText(wrapper, 'cancel', '#15239384')
  })
})
