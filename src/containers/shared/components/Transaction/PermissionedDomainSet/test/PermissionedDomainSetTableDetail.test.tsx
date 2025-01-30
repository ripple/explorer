import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import PermissionedDomainSet from './mock_data/PermissionedDomainSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialSetTableDetail', () => {
  it('renders CredentialSetTableDetail', () => {
    const wrapper = createWrapper(PermissionedDomainSet)

    expect(wrapper.find('domain_id')).toEqual(
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    expect(wrapper.find('accepted_credentials')).toEqual(
      'F075484241C8FD27C750F1DD93E0B5E0A42D9ADFE5E7B2313DD927E3DE0DBA6E',
    )

    wrapper.unmount()
  })
})
