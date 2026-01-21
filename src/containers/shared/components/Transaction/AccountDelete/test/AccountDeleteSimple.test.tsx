import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowLabel,
} from '../../test'
import { Simple } from '../Simple'
import mockAccountDelete from './mock_data/AccountDelete.json'
import mockAccountDeleteWithDestinationTag from './mock_data/AccountDeleteWithDestinationTag.json'
import mockAccountDeleteWithCredentialIDs from './mock_data/AccountDeleteWithCredentialIDs.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('AccountDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockAccountDelete)
    expectSimpleRowText(
      container,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    unmount()
  })

  it('renders with destination tag', () => {
    const { container, unmount } = renderComponent(
      mockAccountDeleteWithDestinationTag,
    )
    expectSimpleRowText(
      container,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:123123',
    )
    unmount()
  })

  it('renders with CredentialIDs', () => {
    const { container, unmount } = renderComponent(
      mockAccountDeleteWithCredentialIDs,
    )

    expectSimpleRowText(
      container,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    expectSimpleRowText(
      container,
      'credential-id-0',
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expectSimpleRowLabel(container, 'credential-id-0', 'credential_ids')

    unmount()
  })
})
