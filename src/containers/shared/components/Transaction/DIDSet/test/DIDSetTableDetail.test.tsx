import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import DIDSet from './mock_data/DIDSet.json'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('DIDSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDSet)
    // eslint-disable-next-line no-useless-concat -- easier to read this way
    expect(wrapper).toHaveText('uri: did_example' + 'did_document: doc')
    wrapper.unmount()
  })
})
