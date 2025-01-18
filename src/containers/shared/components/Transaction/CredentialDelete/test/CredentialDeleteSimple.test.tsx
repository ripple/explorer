import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialDelete from './mock_data/CredentialDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialDelete)
    expectSimpleRowText(
      wrapper,
      'account',
      'r3ZenwRbVqtkqrZsP9BVxKS8iDu3EsCwyc',
    )
    expectSimpleRowText(
      wrapper,
      'credential-type',
      '4D7920746573742063726564656E7469616C',
    )
    expectSimpleRowText(wrapper, 'subject', '120')
    expectSimpleRowText(wrapper, 'issuer', '')

    wrapper.unmount()
  })
})
