import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialCreate: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialCreate)
    expectSimpleRowText(
      wrapper,
      'subject',
      'r9U9hxv27pCb6G3kq26dZD1QVNRUcgcmF3',
    )
    expectSimpleRowText(wrapper, 'credential-type', 'My test credential')
    expectSimpleRowText(wrapper, 'expiration', '100')
    expectSimpleRowText(wrapper, 'uri', 'testURI')

    wrapper.unmount()
  })
})
