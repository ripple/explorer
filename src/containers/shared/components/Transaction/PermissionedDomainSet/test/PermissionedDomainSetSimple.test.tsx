import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('PermissionedDomainSetSimple: Renders', () => {
  it('renders', () => {
    const wrapper = createWrapper(PermissionedDomainSet)
    expectSimpleRowText(
      wrapper,
      'domain_id',
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )
    expectSimpleRowText(
      wrapper,
      'accepted_credentials',
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    wrapper.unmount()
  })
})
