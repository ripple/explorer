import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanDelete from './mock_data/LoanDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(LoanDelete)
    expectSimpleRowText(
      container,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    unmount()
  })
})
