import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockAccountDelete from './mock_data/AccountDelete.json'
import mockAccountDeleteWithDestinationTag from './mock_data/AccountDeleteWithDestinationTag.json'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AccountDelete: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockAccountDelete)
    expect(screen.find('.label')).toHaveText('destination')
    expect(screen.find('.value')).toHaveText(
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
  })

  it('renders with destination tag', () => {
    renderComponent(mockAccountDeleteWithDestinationTag)
    expect(screen.find('.label')).toHaveText('destination')
    expect(screen.find('.value')).toHaveText(
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:123123',
    )
  })
})
