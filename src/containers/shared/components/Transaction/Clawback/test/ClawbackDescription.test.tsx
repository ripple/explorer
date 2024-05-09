import { cleanup, screen } from '@testing-library/react'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import transaction from './mock_data/Clawback.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('Clawback - Description', () => {
  afterEach(cleanup)
  it('handles Clawback Description ', () => {
    renderComponent(transaction)
    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9 claws back from rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP`,
    )
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `The max clawback amount is 4,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9`,
    )
  })
})
