import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockTrustSet from './mock_data/TrustSet.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const createWrapper = createSimpleRenderFactory(Simple, i18n)

describe('TrustSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockTrustSet)
    expectSimpleRowLabel(wrapper, 'amount', 'Set Trust Limit')
    expectSimpleRowText(
      wrapper,
      'amount',
      `CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA`,
    )
    wrapper.unmount()
  })
})
