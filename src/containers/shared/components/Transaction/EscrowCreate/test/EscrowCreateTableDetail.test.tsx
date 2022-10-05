import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowCreate from './mock_data/EscrowCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('EscrowCreateTableDetail', () => {
  it('renders EscrowCreate without crashing', () => {
    const wrapper = createWrapper(mockEscrowCreate)
    expect(wrapper.find('[data-test="account"]')).toHaveText(
      ` rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q `,
    )
    expect(wrapper.find('[data-test="amount"]')).toHaveText(`997.50 XRP`)
    expect(wrapper.find('[data-test="condition"]')).toHaveText(
      ` A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120 `,
    )
    expect(wrapper.find('[data-test="finish_after"]')).toHaveText(
      `March 1, 2020, 9:01:00 AM UTC`,
    )
    expect(wrapper.find('[data-test="cancel_after"]')).toHaveText(
      `March 1, 2020, 8:54:20 AM UTC`,
    )

    wrapper.unmount()
  })
})
