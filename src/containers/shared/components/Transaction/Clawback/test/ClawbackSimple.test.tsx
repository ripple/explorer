import { useQuery } from 'react-query'
import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/Clawback.json'
import transactionFailure from './mock_data/Clawback_Failure.json'
import transactionMPT from './mock_data/ClawbackMPT.json'
import transactionMPTFailure from './mock_data/ClawbackMPT_Failure.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('Clawback - Simple', () => {
  afterEach(cleanup)
  it('handles Clawback simple view ', () => {
    renderComponent(transaction)
    expectSimpleRowText(screen, 'holder', 'rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP')
    expectSimpleRowText(
      screen,
      'amount',
      '3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9',
    )
  })

  it('handles MPT Clawback simple view ', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))
    const wrapper = createWrapper(transactionMPT)
    expectSimpleRowText(wrapper, 'holder', 'rUZTPFN7MBJkjiZ48rak6q7MbhT4ur2kAD')
    expectSimpleRowText(
      wrapper,
      'amount',
      '0.05 MPT (00000D668E702F54A27C42EF98C13B0787D1766CC9162A47)',
    )

    wrapper.unmount()
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

  it('handles failed MPT Clawback simple view ', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))
    const wrapper = createWrapper(transactionMPTFailure)

    expectSimpleRowText(wrapper, 'holder', 'r9rAqX8Jjo4uACsimYDVsy5thHDPivujqf')
    expectSimpleRowText(
      wrapper,
      'amount',
      '0.05 MPT (000010952ECE2AFC727F1C67EF568F360A2D92CB7C29FF7C)',
    )
    wrapper.unmount()
  })
})
