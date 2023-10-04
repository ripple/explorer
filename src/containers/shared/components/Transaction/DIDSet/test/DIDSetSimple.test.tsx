import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import DIDSet from './mock_data/DIDSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('DIDSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(DIDSet)
    expectSimpleRowText(wrapper, 'uri', 'did_example')
    expectSimpleRowText(wrapper, 'did-document', 'doc')
    expectSimpleRowText(wrapper, 'attestation', 'attest')
    wrapper.unmount()
  })
})
