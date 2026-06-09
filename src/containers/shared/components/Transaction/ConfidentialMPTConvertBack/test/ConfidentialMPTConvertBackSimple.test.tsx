import { useQuery } from 'react-query'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTConvertBack.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('ConfidentialMPTConvertBack: Simple', () => {
  it('renders convert back amount', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowText(
      container,
      'convert-back',
      '2 0000001365FEC4C03F5B3D9FD06C6EBCEA05A5B04BEDAFCA',
    )
    unmount()
  })
})
