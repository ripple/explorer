import { TableDetail } from '../TableDetail'
import mockEscrowCancel from './mock_data/EscrowCancel.json'
import { createTableDetailRenderFactory } from '../../test'
import i18nTestConfigEnUS from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(
  TableDetail,
  i18nTestConfigEnUS,
)

describe('EscrowCancelTableDetail', () => {
  it('renders EscrowCancel without crashing', () => {
    const { container, unmount } = renderComponent(
      mockEscrowCancel['EscrowCancel having XRP escrowed'],
    )
    expect(container).toHaveTextContent(
      'cancel escrow rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    unmount()
  })
})
