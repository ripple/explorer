import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialAccept from './mock_data/CredentialAccept.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialAccepr: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialAccept)
    expectSimpleRowText(wrapper, 'issuer', 'rniD1P4EG6htqAiYTqBJhPDjCYZaAKH4Xa')
    expectSimpleRowText(
      wrapper,
      'credential-type',
      '4D7920746573742063726564656E7469616C',
    )

    wrapper.unmount()
  })
})
