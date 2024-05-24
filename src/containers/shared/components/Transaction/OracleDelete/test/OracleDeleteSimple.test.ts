import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleDelete from './mock_data/OracleDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)
describe('OracleDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(OracleDelete)
    expectSimpleRowText(wrapper, 'oracle-document-id', '1')
    wrapper.unmount()
  })
})
