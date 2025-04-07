import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import PermissionedDomainDelete from './mock_data/PermissionedDomainDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('PermissionedDomainDeleteSimple: Renders', () => {
  it('renders', () => {
    const wrapper = createWrapper(PermissionedDomainDelete)
    expectSimpleRowText(
      wrapper,
      'domain-id',
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    wrapper.unmount()
  })
})
