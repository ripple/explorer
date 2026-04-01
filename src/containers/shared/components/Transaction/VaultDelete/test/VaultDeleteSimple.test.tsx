import { expectSimpleRowText, createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultDelete from './mock_data/VaultDelete.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('VaultDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultDelete)
    expectSimpleRowText(
      container,
      'vault_id',
      '2AA88C4CA646645E35E38B8D51CD2CA50BDE14A3F3FFE3838F2C8DCE95C2BABD',
    )
    unmount()
  })
})
