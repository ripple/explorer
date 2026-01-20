import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import PermissionedDomainDelete from './mock_data/PermissionedDomainDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('PermissionedDomainDeleteSimple: Renders', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(PermissionedDomainDelete)
    expectSimpleRowText(
      container,
      'domain-id',
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    unmount()
  })
})
