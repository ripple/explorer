import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultDelete from './mock_data/VaultDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('VaultDeleteTableDetail', () => {
  it('render VaultDeleteTableDetail', () => {
    const { container, unmount } = renderComponent(mockVaultDelete)
    expect(container).toHaveTextContent(
      // "deletes vault" is displayed on the UI
      'deletesvault with id 2AA88C4CA646645E35E38B8D51CD2CA50BDE14A3F3FFE3838F2C8DCE95C2BABD',
    )
    unmount()
  })
})
