import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import offerCancel from './mock_data/OfferCancel.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OfferCancel: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(offerCancel)

    expect(wrapper).toHaveText('cancel_offer #15239384')
  })
})
