import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockAccountDelete from './mock_data/AccountDelete.json'
import mockAccountDeleteWithDestinationTag from './mock_data/AccountDeleteWithDestinationTag.json'
import mockAccountDeleteWithCredentialIDs from './mock_data/AccountDeleteWithCredentialIDs.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AccountDelete: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockAccountDelete)
    expectSimpleRowLabel(screen, 'destination', 'destination')
    expectSimpleRowText(
      screen,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
  })

  it('renders with destination tag', () => {
    renderComponent(mockAccountDeleteWithDestinationTag)
    expectSimpleRowLabel(screen, 'destination', 'destination')
    expectSimpleRowText(
      screen,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:123123',
    )
  })

  it('renders with CredentialIDs', () => {
    renderComponent(mockAccountDeleteWithCredentialIDs)

    expectSimpleRowText(
      screen,
      'destination',
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    expectSimpleRowText(
      screen,
      'credential-id-0',
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expectSimpleRowLabel(screen, 'credential-id-0', 'credential_ids')
  })
})
