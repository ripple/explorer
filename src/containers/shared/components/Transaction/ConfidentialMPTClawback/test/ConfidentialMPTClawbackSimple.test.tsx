import { useQuery } from 'react-query'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTClawback.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('ConfidentialMPTClawback: Simple', () => {
  it('renders holder and clawback amount', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowText(
      container,
      'holder',
      'rUjang388WcsPj7EhPsx2Fk3SvrTBungm4',
    )
    expectSimpleRowText(
      container,
      'clawback',
      '4 00000022B1E8E10FDFDE5FE5E1216354815553542AE38AF1',
    )
    unmount()
  })
})
