import { expectSimpleRowText, createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultWithdraw from './mock_data/VaultWithdraw.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('VaultWithdraw: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultWithdraw)
    expectSimpleRowText(
      container,
      'vault_id',
      'FCC4FB21E6F5B3E60661730C7F6F13A100E1E89FF4CF854D9A9B2F3DF967FD77',
    )
    expectSimpleRowText(
      container,
      'amount',
      '$5.00 USD.rMab3itPzruo5HLEVherc93Prf4tg5d7dx',
    )
    unmount()
  })
})
