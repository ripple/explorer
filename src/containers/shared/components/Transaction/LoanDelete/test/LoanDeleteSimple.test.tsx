import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanDelete from './mock_data/LoanDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanDelete)
    expectSimpleRowText(
      wrapper,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    wrapper.unmount()
  })
})
