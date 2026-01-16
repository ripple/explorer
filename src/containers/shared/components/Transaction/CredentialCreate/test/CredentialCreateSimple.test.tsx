import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialCreate from './mock_data/CredentialCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CredentialCreate: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(CredentialCreate)
    expectSimpleRowText(
      container,
      'subject',
      'rDeEwcsbGz4GXyGpyRuQo9vRGGT269Jmjk',
    )
    expectSimpleRowText(container, 'credential-type', 'VerifiedAccount')
    expectSimpleRowText(
      container,
      'expiration',
      'October 5, 2026 at 1:53:30 PM',
    )

    unmount()
  })
})
