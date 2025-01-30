import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialAccept from './mock_data/CredentialAccept.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const wrapper = createWrapper(mockCredentialAccept)

    expect(wrapper.find('issuer')).toEqual('rniD1P4EG6htqAiYTqBJhPDjCYZaAKH4Xa')
    expect(wrapper.find('credential-type')).toEqual('My test credential')

    wrapper.unmount()
  })
})
