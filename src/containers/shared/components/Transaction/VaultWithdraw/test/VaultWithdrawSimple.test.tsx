import { expectSimpleRowText, createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultWithdraw from './mock_data/VaultWithdraw.json'
import mockVaultWithdrawWithCredentials from './mock_data/VaultWithdrawWithCredentials.json'

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
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders credential IDs for a permissioned-domain withdrawal', () => {
    const { container, unmount } = renderComponent(
      mockVaultWithdrawWithCredentials,
    )
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).toHaveTextContent(
      'EA85E9D5B4F0D8E36C5F1A4B8C2D3E4F5061728394A5B6C7D8E9F0A1B2C3D4E5',
    )
    expect(
      container.querySelector('[data-testid="credential-id-1"]'),
    ).toHaveTextContent(
      'FB96FAE6C501E9F47D6F2B5C9D3E4F5061728394A5B6C7D8E9F0A1B2C3D4E5F6',
    )
    unmount()
  })
})
