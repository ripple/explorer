import { useQuery } from '@tanstack/react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/ConfidentialMPTConvert.json'

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('ConfidentialMPTConvert: TableDetail', () => {
  it('renders convert details', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    const detail = container.querySelector('.confidential-mpt-convert')
    expect(detail).toHaveTextContent('convert')
    expect(detail).toHaveTextContent('03631B...6F8A')
    unmount()
  })
})
