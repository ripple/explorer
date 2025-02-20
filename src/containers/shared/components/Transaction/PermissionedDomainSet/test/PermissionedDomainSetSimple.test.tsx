import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('PermissionedDomainSetSimple: Renders', () => {
  it('renders', () => {
    const wrapper = createWrapper(PermissionedDomainSet)

    expectSimpleRowText(
      wrapper,
      'cred-type',
      '4964656E74697479446F63756D656E74',
    )
    expectSimpleRowText(
      wrapper,
      'cred-issuer',
      'rUVQzukKnGSw4qNjEvBxLxquaLaMwzVBab',
    )

    wrapper.unmount()
  })
})
