import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultWithdraw from './mock_data/VaultWithdraw.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('VaultWithdrawTableDetail', () => {
  it('render VaultWithdrawTableDetail', () => {
    const { container, unmount } = renderComponent(mockVaultWithdraw)
    expect(container).toHaveTextContent(
      // "withdraws $5.00" is displayed on the UI
      'withdraws$5.00 USD.rMab3itPzruo5HLEVherc93Prf4tg5d7dxfrom Vault IDFCC4FB21E6F5B3E60661730C7F6F13A100E1E89FF4CF854D9A9B2F3DF967FD77',
    )
    unmount()
  })
})
