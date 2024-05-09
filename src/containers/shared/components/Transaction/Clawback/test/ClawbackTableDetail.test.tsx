import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/Clawback.json'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('Clawback', () => {
  it('handles Clawback TableDetail ', () => {
    const wrapper = createWrapper(transaction)
    expect(wrapper.find('.clawback')).toHaveText(
      `claws_back3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9fromrscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP`,
    )
    wrapper.unmount()
  })
})
