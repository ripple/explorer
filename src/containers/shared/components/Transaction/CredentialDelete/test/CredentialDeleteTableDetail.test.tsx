import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialDelete from './mock_data/CredentialDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('CredentialDeleteTableDetail ', () => {
  it('renders CredentialDeleteTableDetail', () => {
    const { container, unmount } = renderComponent(mockCredentialDelete)

    expect(
      container.querySelector('[data-testid="subject"]'),
    ).toHaveTextContent('subject: rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6')
    expect(
      container.querySelector('[data-testid="credential-type"]'),
    ).toHaveTextContent('credential_type: My test credential')
    expect(container.querySelector('[data-testid="issuer"]')).toHaveTextContent(
      'issuer: rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi',
    )

    unmount()
  })
})
