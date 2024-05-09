import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import offerCancel from './mock_data/OfferCancel.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('OfferCancel: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(offerCancel)

    expectSimpleRowText(screen, 'cancel', '#15239384')
  })
})
