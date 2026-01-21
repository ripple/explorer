import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultCreate from './mock_data/VaultCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('VaultCreateTableDetail', () => {
  it('render VaultCreateTableDetail', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expect(container).toHaveTextContent(
      // "create vault" is displayed on the UI
      'Createvault for USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    unmount()
  })
})
