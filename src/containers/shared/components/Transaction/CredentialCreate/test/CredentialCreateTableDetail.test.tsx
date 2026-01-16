import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialCreate from './mock_data/CredentialCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const { container, unmount } = renderComponent(mockCredentialCreate)

    expect(container.querySelector('[data-testid="subject"]')).toHaveTextContent(
      'subject: rDeEwcsbGz4GXyGpyRuQo9vRGGT269Jmjk',
    )
    expect(container.querySelector('[data-testid="credential-type"]')).toHaveTextContent(
      'credential_type: VerifiedAccount',
    )
    expect(container.querySelector('[data-testid="expiration"]')).toHaveTextContent(
      'expiration: 844523610',
    )

    unmount()
  })
})
