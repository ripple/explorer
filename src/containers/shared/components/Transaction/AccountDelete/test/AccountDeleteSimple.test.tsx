import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockAccountDelete from './mock_data/AccountDelete.json'
import mockAccountDeleteWithDestinationTag from './mock_data/AccountDeleteWithDestinationTag.json'

const createWrapper = createSimpleRenderFactory(Simple, i18n)

describe('AccountDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockAccountDelete)
    expect(wrapper.find('.label')).toHaveText('destination')
    expect(wrapper.find('.value')).toHaveText(
      'raT74sdzpxJUaubcBAQNS8aLqFMU85Rr5J',
    )
    wrapper.unmount()
  })

  it('renders with destination tag', () => {
    const wrapper = createWrapper(mockAccountDeleteWithDestinationTag)
    expect(wrapper.find('.label')).toHaveText('destination')
    expect(wrapper.find('.value')).toHaveText(
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:123123',
    )
    wrapper.unmount()
  })
})
