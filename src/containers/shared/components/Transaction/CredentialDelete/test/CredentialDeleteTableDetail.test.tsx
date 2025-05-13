import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialDelete from './mock_data/CredentialDelete.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialDeleteTableDetail ', () => {
  it('renders CredentialDeleteTableDetail', () => {
    const wrapper = createWrapper(mockCredentialDelete)

    expect(wrapper.find('[data-test="subject"]')).toHaveText(
      'subject: rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6',
    )
    expect(wrapper.find('[data-test="credential-type"]')).toHaveText(
      'credential_type: My test credential',
    )
    expect(wrapper.find('[data-test="issuer"]')).toHaveText(
      'issuer: rL6bethyyyphLye6A8WHhw1KxDZrwiqCmi',
    )

    wrapper.unmount()
  })
})
