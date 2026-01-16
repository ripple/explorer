import { useQuery } from 'react-query'
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

describe('Clawback', () => {
  it('handles Clawback simple view ', () => {
    const { container, unmount } = renderComponent(transaction)
    expectSimpleRowText(container, 'holder', 'rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP')
    expectSimpleRowText(
      container,
      'amount',
      '3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9',
    )
    unmount()
  })

  it('handles MPT Clawback simple view ', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))
    const { container, unmount } = renderComponent(transactionMPT)
    expectSimpleRowText(container, 'holder', 'rUZTPFN7MBJkjiZ48rak6q7MbhT4ur2kAD')
    expectSimpleRowText(
      container,
      'amount',
      '0.05 MPT (00000D668E702F54A27C42EF98C13B0787D1766CC9162A47)',
    )

    unmount()
  })

  it('handles failed Clawback simple view ', () => {
    const { container, unmount } = renderComponent(transactionFailure)
    expectSimpleRowText(container, 'holder', 'rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9')
    expectSimpleRowText(
      container,
      'amount',
      '4,840.00 FOO.rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP',
    )
    unmount()
  })

  it('handles failed MPT Clawback simple view ', () => {
    const data = {
      assetScale: 3,
    }

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data,
    }))
    const { container, unmount } = renderComponent(transactionMPTFailure)

    expectSimpleRowText(container, 'holder', 'r9rAqX8Jjo4uACsimYDVsy5thHDPivujqf')
    expectSimpleRowText(
      container,
      'amount',
      '0.05 MPT (000010952ECE2AFC727F1C67EF568F360A2D92CB7C29FF7C)',
    )
    unmount()
  })
})
