import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialAccept from './mock_data/CredentialAccept.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialAccept: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialAccept)
    expectSimpleRowText(wrapper, 'issuer', 'rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi')
    expectSimpleRowText(wrapper, 'credential-type', 'My test credential')

    wrapper.unmount()
  })
})
