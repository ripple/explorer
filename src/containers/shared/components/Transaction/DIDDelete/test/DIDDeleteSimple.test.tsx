import { createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import DIDDelete from './mock_data/DIDDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('DIDDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDDelete)
    wrapper.unmount()
  })
})
