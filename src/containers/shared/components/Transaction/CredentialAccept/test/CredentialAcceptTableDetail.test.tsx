import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialAccept from './mock_data/CredentialAccept.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const wrapper = createWrapper(mockCredentialAccept)

    expect(wrapper.find('[data-test="issuer"]')).toHaveText(
      'issuer: rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi',
    )
    expect(wrapper.find('[data-test="credential-type"]')).toHaveText(
      'credential_type: My test credential',
    )

    wrapper.unmount()
  })
})
