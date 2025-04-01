import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import DIDSet from './mock_data/DIDSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('DIDSet: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDSet)
    expect(wrapper).toHaveText(
      // eslint-disable-next-line no-useless-concat -- easier to read this way
      'uri: did_example' + 'did_document: doc' + 'data: attest',
    )
    wrapper.unmount()
  })
})
