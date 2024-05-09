import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('PermissionedDomainSetTableDetail', () => {
  it('renders PermissionedDomainSetTableDetail', () => {
    const wrapper = createWrapper(PermissionedDomainSet)

    expect(wrapper.find('[data-testid="cred-type"]')).toHaveText(
      'credential_type: 4964656E74697479446F63756D656E74',
    )
    expect(wrapper.find('[data-testid="cred-issuer"]')).toHaveText(
      'credential_issuer: rUVQzukKnGSw4qNjEvBxLxquaLaMwzVBab',
    )

    wrapper.unmount()
  })
})
