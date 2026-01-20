import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockTrustSet from './mock_data/TrustSet.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('TrustSet: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockTrustSet)
    expectSimpleRowLabel(container, 'amount', 'Set Trust Limit')
    expectSimpleRowText(
      container,
      'amount',
      `CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA`,
    )
    unmount()
  })
})
