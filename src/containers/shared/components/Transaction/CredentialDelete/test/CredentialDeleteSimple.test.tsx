import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialDelete from './mock_data/CredentialDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialDelete)

    expectSimpleRowText(
      wrapper,
      'subject',
      'rU893VJVdc5W2kQ6gTCDieo8sNHiHyE7Rd',
    )
    expectSimpleRowText(wrapper, 'issuer', 'rniD1P4EG6htqAiYTqBJhPDjCYZaAKH4Xa')
    expectSimpleRowText(
      wrapper,
      'credential-type',
      '4D7920746573742063726564656E7469616C',
    )

    wrapper.unmount()
  })
})
