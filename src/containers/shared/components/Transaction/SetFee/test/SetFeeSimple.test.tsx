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

function testSimple(container: Element) {
  expectSimpleRowLabel(container, `base-fee`, 'Base Fee')
  expectSimpleRowText(container, `base-fee`, `\uE9000.00001 XRP`)
  expectSimpleRowLabel(container, `reserve`, 'Reserve')
  expectSimpleRowText(container, `reserve`, `\uE90010.00 XRP`)
  expectSimpleRowLabel(container, `reserve-increment`, 'Reserve Increment')
  expectSimpleRowText(container, `reserve-increment`, `\uE9002.00 XRP`)
}

describe('SetFee: Simple', () => {
  it('renders Simple for transaction before XRPFees amendment', () => {
    const { container, unmount } = renderComponent(SetFeePreAmendment)
    testSimple(container)
    unmount()
  })

  it('renders Simple for transaction after XRPFees amendment', () => {
    const { container, unmount } = renderComponent(SetFeePostAmendment)
    testSimple(container)
    unmount()
  })
})
