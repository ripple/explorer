import {
  expectSimpleRowText,
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import mockVaultCreate from './mock_data/VaultCreate.json'
import mockVaultCreateClosedEnded from './mock_data/VaultCreateClosedEnded.json'

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
    // An open-ended vault omits VaultKind entirely, so no closed-ended rows.
    expectSimpleRowNotToExist(container, 'vault_kind')
    expectSimpleRowNotToExist(container, 'subscription_date')
    expectSimpleRowNotToExist(container, 'redemption_date')

    unmount()
  })

  it('renders a closed-ended vault', () => {
    const { container, unmount } = renderComponent(mockVaultCreateClosedEnded)

    expectSimpleRowText(container, 'vault_kind', 'closed_ended')
    expectSimpleRowText(
      container,
      'subscription_date',
      'July 28, 2025 at 3:00:00 PM UTC',
    )
    expectSimpleRowText(
      container,
      'redemption_date',
      'July 28, 2025 at 3:05:00 PM UTC',
    )

    unmount()
  })
})
