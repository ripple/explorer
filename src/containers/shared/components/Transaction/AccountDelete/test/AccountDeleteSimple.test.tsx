import {
  createSimpleWrapperFactory,
  expectSimpleRowText,
  expectSimpleRowLabel,
} from '../../test'
import { Simple } from '../Simple'
import mockAccountDelete from './mock_data/AccountDelete.json'
import mockAccountDeleteWithDestinationTag from './mock_data/AccountDeleteWithDestinationTag.json'
import mockAccountDeleteWithCredentialIDs from './mock_data/AccountDeleteWithCredentialIDs.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('AccountDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockAccountDelete)
    expectSimpleRowText(
      wrapper,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    wrapper.unmount()
  })

  it('renders with destination tag', () => {
    const wrapper = createWrapper(mockAccountDeleteWithDestinationTag)
    expectSimpleRowText(
      wrapper,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:123123',
    )
    wrapper.unmount()
  })

  it('renders with CredentialIDs', () => {
    const wrapper = createWrapper(mockAccountDeleteWithCredentialIDs)

    expectSimpleRowText(
      wrapper,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    expectSimpleRowText(
      wrapper,
      'credential-id-0',
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expectSimpleRowLabel(wrapper, 'credential-id-0', 'credential_ids')

    wrapper.unmount()
  })
})
