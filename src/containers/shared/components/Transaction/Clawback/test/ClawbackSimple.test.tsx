import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/Clawback.json'
import transactionFailure from './mock_data/Clawback_Failure.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('Clawback: Simple', () => {
  afterEach(cleanup)
  it('handles Clawback simple view ', () => {
    renderComponent(transaction)
    expectSimpleRowText(screen, 'holder', 'rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP')
    screen.debug()
    expectSimpleRowText(
      screen,
      'amount',
      '3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9',
    )
  })

  it('handles failed Clawback simple view ', () => {
    renderComponent(transactionFailure)
    expectSimpleRowText(screen, 'holder', 'rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9')
    expectSimpleRowText(
      screen,
      'amount',
      '4,840.00 FOO.rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP',
    )
  })
})
