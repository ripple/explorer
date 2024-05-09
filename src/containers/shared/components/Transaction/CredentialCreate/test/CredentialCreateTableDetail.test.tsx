import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const wrapper = createWrapper(mockCredentialCreate)

    expect(wrapper.find('[data-testid="subject"]')).toHaveText(
      'subject: rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6',
    )
    expect(wrapper.find('[data-testid="credential-type"]')).toHaveText(
      'credential_type: My test credential',
    )
    expect(wrapper.find('[data-testid="uri"]')).toHaveText('uri: testURI')

    wrapper.unmount()
  })
})
