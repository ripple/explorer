import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import DIDSet from './mock_data/DIDSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('DIDSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDSet)
    expect(wrapper).toHaveText('uri: did_example' + 'did_document: doc')
    wrapper.unmount()
  })
})
