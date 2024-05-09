import { cleanup, screen } from '@testing-library/react'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

import SetFeePreAmendment from './mock_data/SetFee_PreAmendment.json'
import SetFeePostAmendment from './mock_data/SetFee_PostAmendment.json'

const renderComponent = createDescriptionRenderFactory(
  Description,
  i18nTestConfigEnUS,
)

function testDescription(wrapper) {
  expect(wrapper.find('[data-testid="fees-line"]')).toHaveText(
    `Future transactions will require a minimum fee of \uE9000.00001 XRP.`,
  )
  expect(wrapper.find('[data-testid="reserves-line"]')).toHaveText(
    `Accounts must now hold a base of \uE90010.00 XRP and an additional \uE9002.00 XRP for each additional object that account owns.`,
  )
  expect(wrapper.find('[data-testid="documentation-line"]')).toHaveText(
    `Visit the docs: Fees`,
  )
}

describe('SetFee: Description', () => {
  afterEach(cleanup)
  it('renders Description for transaction before XRPFees amendment', () => {
    renderComponent(SetFeePreAmendment)
    testDescription(wrapper)
    wrapper.unmount()
  })

  it('renders Description for transaction after XRPFees amendment', () => {
    renderComponent(SetFeePostAmendment)
    testDescription(wrapper)
    wrapper.unmount()
  })
})
