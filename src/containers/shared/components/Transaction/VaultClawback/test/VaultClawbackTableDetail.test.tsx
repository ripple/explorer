import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultClawback from './mock_data/VaultClawback.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('VaultClawbackTableDetail', () => {
  it('render VaultClawbackTableDetail', () => {
    const { container, unmount } = renderComponent(mockVaultClawback)
    expect(container).toHaveTextContent(
      'Claws back $5.00 USD.rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ from raMUwNw4u59UU9WWpqZYYEj77y8yZhC6Wp',
    )
    unmount()
  })
})
