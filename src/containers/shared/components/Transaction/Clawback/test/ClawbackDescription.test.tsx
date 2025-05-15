import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import transaction from './mock_data/Clawback.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('Clawback', () => {
  it('handles Clawback Description ', () => {
    const wrapper = createWrapper(transaction)
    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9 claws back from rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP`,
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `The max clawback amount is 4,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9`,
    )
    wrapper.unmount()
  })
})
