import NewEscrowCreate from './mock_data/NewEscrowCreate.json'
import { DefaultSimple } from '../DefaultSimple'
import { createSimpleWrapperFactory } from './createWrapperFactory'
import { expectSimpleRowText } from './expectations'

const createWrapper = createSimpleWrapperFactory(DefaultSimple)

describe('DefaultSimple', () => {
  it('renders Simple for transaction', () => {
    const wrapper = createWrapper(NewEscrowCreate)
    expectSimpleRowText(
      wrapper,
      'Destination',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expectSimpleRowText(wrapper, 'Amount', '1000000')
    expectSimpleRowText(wrapper, 'FinishAfter', '736447590')
    wrapper.unmount()
  })
})
