import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleDelete from './mock_data/OracleDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)
describe('OracleDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(OracleDelete)
    expectSimpleRowText(container, 'oracle-document-id', '1')
    unmount()
  })
})
