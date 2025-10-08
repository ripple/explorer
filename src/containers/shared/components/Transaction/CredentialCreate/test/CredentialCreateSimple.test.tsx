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
      'rDeEwcsbGz4GXyGpyRuQo9vRGGT269Jmjk',
    )
    expectSimpleRowText(wrapper, 'credential-type', 'VerifiedAccount')
    expectSimpleRowText(wrapper, 'expiration', 'October 5, 2026 at 1:53:30 PM')

    wrapper.unmount()
  })
})
