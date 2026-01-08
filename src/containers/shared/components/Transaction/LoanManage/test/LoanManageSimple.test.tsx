import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanManage from './mock_data/LoanManage.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanManage: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanManage)
    expectSimpleRowText(
      wrapper,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    wrapper.unmount()
  })
})
