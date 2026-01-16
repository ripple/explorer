import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('PermissionedDomainSetTableDetail', () => {
  it('renders PermissionedDomainSetTableDetail', () => {
    const { container, unmount } = renderComponent(PermissionedDomainSet)

    expect(container.querySelector('[data-testid="cred-type"]')).toHaveTextContent(
      'credential_type: 4964656E74697479446F63756D656E74',
    )
    expect(container.querySelector('[data-testid="cred-issuer"]')).toHaveTextContent(
      'credential_issuer: rUVQzukKnGSw4qNjEvBxLxquaLaMwzVBab',
    )

    unmount()
  })
})
