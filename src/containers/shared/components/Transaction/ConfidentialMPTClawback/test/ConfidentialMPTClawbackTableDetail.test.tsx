import { useQuery } from 'react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/ConfidentialMPTClawback.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('ConfidentialMPTClawback: TableDetail', () => {
  it('renders clawback details with holder', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 2 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    const detail = container.querySelector('.confidential-mpt-clawback')
    expect(detail).toHaveTextContent('claws_back')
    expect(detail).toHaveTextContent('from')
    expect(detail).toHaveTextContent('rUjang388WcsPj7EhPsx2Fk3SvrTBungm4')
    unmount()
  })
})
