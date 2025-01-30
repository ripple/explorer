import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import PermissionedDomainDelete from './mock_data/PermissionedDomainDelete.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialDeleteTableDetail ', () => {
  it('renders CredentialDeleteTableDetail', () => {
    const wrapper = createWrapper(PermissionedDomainDelete)

    expect(wrapper.find('domain_id')).toEqual(
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    wrapper.unmount()
  })
})
