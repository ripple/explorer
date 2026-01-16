import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialAccept from './mock_data/CredentialAccept.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CredentialAccept: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(CredentialAccept)
    expectSimpleRowText(container, 'issuer', 'rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi')
    expectSimpleRowText(container, 'credential-type', 'My test credential')

    unmount()
  })
})
