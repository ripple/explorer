import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialDelete from './mock_data/CredentialDelete.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialDeleteTableDetail ', () => {
  it('renders CredentialDeleteTableDetail', () => {
    const wrapper = createWrapper(mockCredentialDelete)

    expect(wrapper.find('subject')).toEqual(
      'rU893VJVdc5W2kQ6gTCDieo8sNHiHyE7Rd',
    )
    expect(wrapper.find('issuer')).toEqual('rniD1P4EG6htqAiYTqBJhPDjCYZaAKH4Xa')
    expect(wrapper.find('credential-type')).toEqual('My test credential')

    wrapper.unmount()
  })
})
