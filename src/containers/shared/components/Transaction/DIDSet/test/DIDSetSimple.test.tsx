import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import DIDSet from './mock_data/DIDSet.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('DIDSet: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(DIDSet)
    expectSimpleRowText(container, 'uri', 'did_example')
    expectSimpleRowText(container, 'did-document', 'doc')
    expectSimpleRowText(container, 'data', 'attest')
    unmount()
  })
})
