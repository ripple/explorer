import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import PermissionedDomainDelete from './mock_data/PermissionedDomainDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('PermissionedDomainDeleteTableDetail ', () => {
  it('renders PermissionedDomainDeleteTableDetail', () => {
    const { container, unmount } = renderComponent(PermissionedDomainDelete)

    expect(
      container.querySelector('[data-testid="domain-id"]'),
    ).toHaveTextContent(
      'domain_id: F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    unmount()
  })
})
