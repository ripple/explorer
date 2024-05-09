import {
  createSimpleRenderFactory,
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../test'
import { Simple } from '../Simple'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

import SetFeePreAmendment from './mock_data/SetFee_PreAmendment.json'
import SetFeePostAmendment from './mock_data/SetFee_PostAmendment.json'

const createWrapper = createSimpleRenderFactory(Simple, i18nTestConfigEnUS)

function testSimple(wrapper) {
  expectSimpleRowLabel(wrapper, `base-fee`, 'Base Fee')
  expectSimpleRowText(wrapper, `base-fee`, `\uE9000.00001 XRP`)
  expectSimpleRowLabel(wrapper, `reserve`, 'Reserve')
  expectSimpleRowText(wrapper, `reserve`, `\uE90010.00 XRP`)
  expectSimpleRowLabel(wrapper, `reserve-increment`, 'Reserve Increment')
  expectSimpleRowText(wrapper, `reserve-increment`, `\uE9002.00 XRP`)
}

describe('SetFee: Simple', () => {
  it('renders Simple for transaction before XRPFees amendment', () => {
    const wrapper = createWrapper(SetFeePreAmendment)
    testSimple(wrapper)
    wrapper.unmount()
  })

  it('renders Simple for transaction after XRPFees amendment', () => {
    const wrapper = createWrapper(SetFeePostAmendment)
    testSimple(wrapper)
    wrapper.unmount()
  })
})
