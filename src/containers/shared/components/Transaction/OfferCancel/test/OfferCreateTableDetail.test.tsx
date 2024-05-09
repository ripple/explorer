import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import offerCancel from './mock_data/OfferCancel.json'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('OfferCancel: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(offerCancel)

    expect(wrapper).toHaveText('cancel_offer #15239384')
  })
})
