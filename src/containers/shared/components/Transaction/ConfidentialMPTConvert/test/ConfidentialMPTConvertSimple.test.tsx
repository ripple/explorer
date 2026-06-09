import { useQuery } from 'react-query'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTConvert.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('ConfidentialMPTConvert: Simple', () => {
  it('renders with holder encryption key', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowText(
      container,
      'convert',
      '1 0000001365FEC4C03F5B3D9FD06C6EBCEA05A5B04BEDAFCA',
    )
    expectSimpleRowText(container, 'holder-encryption-key', '03631B...6F8A')
    unmount()
  })
})
