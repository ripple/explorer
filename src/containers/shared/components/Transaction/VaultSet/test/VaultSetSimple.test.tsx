import {
  expectSimpleRowText,
  createSimpleWrapperFactory,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import mockVaultSet from './mock_data/VaultSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultSet)
    expectSimpleRowText(
      wrapper,
      'asset',
      'USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    expectSimpleRowText(
      wrapper,
      'assets_maximum',
      '$500.00 USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    expectSimpleRowText(wrapper, 'data', '7661756C74206D65746164617461')
    expectSimpleRowText(
      wrapper,
      'mptoken_metadata',
      '7368617265206D65746164617461',
    )
    expectSimpleRowText(wrapper, 'withdrawal_policy', '1')
    expectSimpleRowNotToExist(wrapper, 'domain_id')

    wrapper.unmount()
  })
})
