import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialCreate: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialCreate)
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
    expectSimpleRowText(wrapper, 'fee', '120')
    expectSimpleRowText(wrapper, 'expiration', '')
    expectSimpleRowText(wrapper, 'uri', '')

    wrapper.unmount()
  })
})
