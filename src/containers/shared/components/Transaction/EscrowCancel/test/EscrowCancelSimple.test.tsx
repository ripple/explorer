import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowCancel from './mock_data/EscrowCancel.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('EscrowCancelSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockEscrowCancel)
    expect(wrapper.find('[data-test="escrow-amount"] .value')).toHaveText(
      `\uE900135.79 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-cancel"] .value')).toHaveText(
      'rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    expect(wrapper.find('[data-test="escrow-cancel-tx"] .value')).toHaveText(
      `A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6`,
    )
    wrapper.unmount()
  })
})
