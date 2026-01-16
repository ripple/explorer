import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import transaction from './mock_data/Clawback.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('Clawback', () => {
  it('handles Clawback Description ', () => {
    const { container, unmount } = renderComponent(transaction)
    expect(container.querySelector('[data-testid="from-to-line"]')).toHaveTextContent(
      `rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9 claws back from rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP`,
    )
    expect(container.querySelector('[data-testid="amount-line"]')).toHaveTextContent(
      `The max clawback amount is 4,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9`,
    )
    unmount()
  })
})
