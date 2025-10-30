import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const wrapper = createWrapper(mockCredentialCreate)

    expect(wrapper.find('[data-testid="subject"]')).toHaveText(
      'subject: rDeEwcsbGz4GXyGpyRuQo9vRGGT269Jmjk',
    )
    expect(wrapper.find('[data-testid="credential-type"]')).toHaveText(
      'credential_type: VerifiedAccount',
    )
    expect(wrapper.find('[data-testid="expiration"]')).toHaveText(
      'expiration: 844523610',
    )

    wrapper.unmount()
  })
})
