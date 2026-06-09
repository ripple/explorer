import { useQuery } from 'react-query'
import {
  createSimpleRenderFactory,
  expectSimpleRowLabel,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/ConfidentialMPTSend.json'
import transactionWithCredentialIDs from './mock_data/ConfidentialMPTSendWithCredentialIDs.json'

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

  it('renders credential IDs when present', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(transactionWithCredentialIDs)

    expectSimpleRowText(
      container,
      'credential-id-0',
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expectSimpleRowLabel(container, 'credential-id-0', 'credential_ids')
    expectSimpleRowText(
      container,
      'credential-id-1',
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    expectSimpleRowLabel(container, 'credential-id-1', '')
    unmount()
  })
})
