import { useQuery } from '@tanstack/react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/ConfidentialMPTConvertBack.json'

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('ConfidentialMPTConvertBack: TableDetail', () => {
  it('renders convert back details', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expect(
      container.querySelector('.confidential-mpt-convert-back'),
    ).toHaveTextContent('convert_back')
    unmount()
  })
})
