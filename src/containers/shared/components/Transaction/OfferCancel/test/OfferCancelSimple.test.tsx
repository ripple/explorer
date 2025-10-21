import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import offerCancel from './mock_data/OfferCancel.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('OfferCancel: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(offerCancel)

    expectSimpleRowText(wrapper, 'cancel', '#15239384')
  })
})
