import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanManage from './mock_data/LoanManage.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanManage: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(LoanManage)
    expectSimpleRowText(
      container,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    unmount()
  })
})
