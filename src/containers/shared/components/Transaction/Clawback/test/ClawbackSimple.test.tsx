import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/Clawback.json'
import transactionFailure from './mock_data/Clawback_Failure.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('Clawback', () => {
  it('handles Clawback simple view ', () => {
    const wrapper = createWrapper(transaction)
    expectSimpleRowText(wrapper, 'holder', 'rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP')
    expectSimpleRowText(
      wrapper,
      'amount',
      '3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9',
    )
    wrapper.unmount()
  })

  it('handles failed Clawback simple view ', () => {
    const wrapper = createWrapper(transactionFailure)
    expectSimpleRowText(wrapper, 'holder', 'rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9')
    expectSimpleRowText(
      wrapper,
      'amount',
      '4,840.00 FOO.rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP',
    )
    wrapper.unmount()
  })
})
