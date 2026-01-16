import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialAccept from './mock_data/CredentialAccept.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const { container, unmount } = renderComponent(mockCredentialAccept)

    expect(container.querySelector('[data-testid="issuer"]')).toHaveTextContent(
      'issuer: rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi',
    )
    expect(container.querySelector('[data-testid="credential-type"]')).toHaveTextContent(
      'credential_type: My test credential',
    )

    unmount()
  })
})
