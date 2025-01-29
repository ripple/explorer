import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockCredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('CredentialAcceptTableDetail ', () => {
  it('renders CredentialAcceptTableDetail', () => {
    const wrapper = createWrapper(mockCredentialCreate)

    expect(wrapper.find('subject')).toEqual(
      'r9U9hxv27pCb6G3kq26dZD1QVNRUcgcmF3',
    )
    expect(wrapper.find('credential-type')).toEqual('My test credential')
    expect(wrapper.find('expiration')).toEqual('100')
    expect(wrapper.find('uri')).toEqual('testURI')

    wrapper.unmount()
  })
})
