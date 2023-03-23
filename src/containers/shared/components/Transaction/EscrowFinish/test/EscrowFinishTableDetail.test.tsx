import { describe, it, expect } from 'vitest'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)
describe('EscrowFinishTableDetail', () => {
  it('renders EscrowFinish without crashing', () => {
    const wrapper = createWrapper(mockEscrowFinish)
    expect(wrapper.find('[data-test="escrow-account"]')).toHaveText(
      `finish_escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`,
    )
    expect(wrapper.find('[data-test="escrow-amount"]')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-test="escrow-fullfillment"]')).toHaveText(
      `fulfillment Fulfillment `,
    )
    wrapper.unmount()
  })
})
