import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

import SetFeePreAmendment from './mock_data/SetFee_PreAmendment.json'
import SetFeePostAmendment from './mock_data/SetFee_PostAmendment.json'

const renderComponent = createDescriptionRenderFactory(
  Description,
  i18nTestConfigEnUS,
)

function testDescription(container: Element) {
  expect(
    container.querySelector('[data-testid="fees-line"]'),
  ).toHaveTextContent(
    `Future transactions will require a minimum fee of \uE9000.00001 XRP.`,
  )
  expect(
    container.querySelector('[data-testid="reserves-line"]'),
  ).toHaveTextContent(
    `Accounts must now hold a base of \uE90010.00 XRP and an additional \uE9002.00 XRP for each additional object that account owns.`,
  )
  expect(
    container.querySelector('[data-testid="documentation-line"]'),
  ).toHaveTextContent(`Visit the docs: Fees`)
}

describe('SetFee: Description', () => {
  it('renders Description for transaction before XRPFees amendment', () => {
    const { container, unmount } = renderComponent(SetFeePreAmendment)
    testDescription(container)
    unmount()
  })

  it('renders Description for transaction after XRPFees amendment', () => {
    const { container, unmount } = renderComponent(SetFeePostAmendment)
    testDescription(container)
    unmount()
  })
})
