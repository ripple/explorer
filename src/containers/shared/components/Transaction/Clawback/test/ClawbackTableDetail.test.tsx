import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/Clawback.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('Clawback', () => {
  it('handles Clawback TableDetail ', () => {
    renderComponent(transaction)
    expect(wrapper.find('.clawback')).toHaveText(
      `claws_back3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9fromrscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP`,
    )
  })
})
