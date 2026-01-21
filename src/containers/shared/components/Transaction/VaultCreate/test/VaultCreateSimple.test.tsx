import {
  expectSimpleRowText,
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import mockVaultCreate from './mock_data/VaultCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('VaultCreate: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expectSimpleRowText(
      container,
      'asset',
      'USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    expectSimpleRowText(container, 'assets_maximum', '500')
    expectSimpleRowText(container, 'data', '7661756C74206D65746164617461')
    expectSimpleRowText(
      container,
      'mptoken_metadata',
      '7368617265206D65746164617461',
    )
    expectSimpleRowText(
      container,
      'withdrawal_policy',
      'vaultStrategyFirstComeFirstServe',
    )
    expectSimpleRowNotToExist(container, 'domain_id')

    unmount()
  })
})
