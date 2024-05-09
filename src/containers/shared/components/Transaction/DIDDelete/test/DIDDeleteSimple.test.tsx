import { createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import DIDDelete from './mock_data/DIDDelete.json'

const createWrapper = createSimpleRenderFactory(Simple)

describe('DIDDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDDelete)
    wrapper.unmount()
  })
})
