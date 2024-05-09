import { cleanup, screen } from '@testing-library/react'
import {
  createSimpleRenderFactory,
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../test'
import { Simple } from '../Simple'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

import SetFeePreAmendment from './mock_data/SetFee_PreAmendment.json'
import SetFeePostAmendment from './mock_data/SetFee_PostAmendment.json'

const renderComponent = createSimpleRenderFactory(Simple, i18nTestConfigEnUS)

function testSimple(wrapper) {
  expectSimpleRowLabel(wrapper, `base-fee`, 'Base Fee')
  expectSimpleRowText(wrapper, `base-fee`, `\uE9000.00001 XRP`)
  expectSimpleRowLabel(wrapper, `reserve`, 'Reserve')
  expectSimpleRowText(wrapper, `reserve`, `\uE90010.00 XRP`)
  expectSimpleRowLabel(wrapper, `reserve-increment`, 'Reserve Increment')
  expectSimpleRowText(wrapper, `reserve-increment`, `\uE9002.00 XRP`)
}

describe('SetFee: Simple', () => {
  afterEach(cleanup)
  it('renders Simple for transaction before XRPFees amendment', () => {
    renderComponent(SetFeePreAmendment)
    testSimple(wrapper)
    wrapper.unmount()
  })

  it('renders Simple for transaction after XRPFees amendment', () => {
    renderComponent(SetFeePostAmendment)
    testSimple(wrapper)
    wrapper.unmount()
  })
})
