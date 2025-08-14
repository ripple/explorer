import {
  expectSimpleRowText,
  createSimpleWrapperFactory,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import mockVaultCreate from './mock_data/VaultCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultCreate: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expectSimpleRowText(
      wrapper,
      'asset',
      'USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    expectSimpleRowText(wrapper, 'assets_maximum', '500')
    expectSimpleRowText(wrapper, 'data', '7661756C74206D65746164617461')
    expectSimpleRowText(
      wrapper,
      'mptoken_metadata',
      '7368617265206D65746164617461',
    )
    expectSimpleRowText(
      wrapper,
      'withdrawal_policy',
      'vaultStrategyFirstComeFirstServe',
    )
    expectSimpleRowNotToExist(wrapper, 'domain_id')

    wrapper.unmount()
  })
})
