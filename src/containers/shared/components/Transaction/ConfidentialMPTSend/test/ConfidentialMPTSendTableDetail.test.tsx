import { useQuery } from 'react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import transaction from './mock_data/ConfidentialMPTSend.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('ConfidentialMPTSend: TableDetail', () => {
  it('renders send details with destination', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    const detail = container.querySelector('.confidential-mpt-send')
    expect(detail).toHaveTextContent('send')
    expect(detail).toHaveTextContent('confidential')
    expect(detail).toHaveTextContent('to')
    expect(detail).toHaveTextContent('rfd4TdoYLvpTsNz6dRm7iZgmwfZMhW9xgK')
    unmount()
  })
})
