import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialDelete from './mock_data/CredentialDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CredentialDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(CredentialDelete)

    expectSimpleRowText(
      container,
      'subject',
      'rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6',
    )
    expectSimpleRowText(container, 'credential-type', 'My test credential')

    unmount()
  })
})
