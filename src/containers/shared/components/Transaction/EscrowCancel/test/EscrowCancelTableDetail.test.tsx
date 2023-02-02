import { TableDetail } from '../TableDetail'
import mockEscrowCancel from './mock_data/EscrowCancel.json'
import { createTableDetailWrapperFactory } from '../../test'
import i18nTestConfigEnUS from '../../../../../../i18nTestConfig.en-US'

const createWrapper = createTableDetailWrapperFactory(
  TableDetail,
  i18nTestConfigEnUS,
)

describe('EscrowCancelTableDetail', () => {
  it('renders EscrowCancel without crashing', () => {
    const wrapper = createWrapper(mockEscrowCancel)
    expect(wrapper).toHaveText(
      'cancel escrow rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    wrapper.unmount()
  })
})
