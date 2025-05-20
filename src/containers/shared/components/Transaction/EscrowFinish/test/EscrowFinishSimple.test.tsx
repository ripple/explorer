import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockEscrowFinish from './mock_data/EscrowFinish.json'
import mockEscrowFinishCompAllow from './mock_data/EscrowFinishComputationAllowance.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('EscrowFinishSimple', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockEscrowFinish)
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-tx"] .value')).toHaveText(
      `3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC`,
    )
    wrapper.unmount()
  })
  it('renders a smart escrow finish properly', () => {
    const wrapper = createWrapper(mockEscrowFinishCompAllow)
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE9000.10 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-tx"] .value')).toHaveText(
      `2C44A096646F815F9072D8FB3954B2B9025C21AE614CE96CB2D2C4907F9B2A1D`,
    )
    expect(
      wrapper.find('[data-testid="computation-allowance"] .value'),
    ).toHaveText('1000000 gas')
    wrapper.unmount()
  })
})
