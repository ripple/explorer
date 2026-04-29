import { useQuery } from 'react-query'
import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTSend.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('ConfidentialMPTSend: Simple', () => {
  it('renders destination and confidential amount', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowText(
      container,
      'destination',
      'rfd4TdoYLvpTsNz6dRm7iZgmwfZMhW9xgK',
    )
    expectSimpleRowText(container, 'send', 'confidential')
    unmount()
  })

  it('does not render credential IDs when absent', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transaction)

    expectSimpleRowNotToExist(container, 'credential-id-0')
    unmount()
  })
})
