import { TableDetail } from '../TableDetail'
import mockEscrowCancel from './mock_data/EscrowCancel.json'
import { createTableDetailWrapperFactory } from '../../test'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('EscrowCancelTableDetail', () => {
  it('renders EscrowCancel without crashing', () => {
    const wrapper = createWrapper(mockEscrowCancel)
    wrapper.unmount()
  })
})
