import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockTrustSet from './mock_data/TrustSet.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('TrustSet: Simple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockTrustSet)
    expectSimpleRowLabel(screen, 'limit-amount', 'Set Trust Limit')
    expectSimpleRowText(
      screen,
      'limit-amount',
      `CN¥1,000,000,000.00 CNY.razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA`,
    )
  })
})
