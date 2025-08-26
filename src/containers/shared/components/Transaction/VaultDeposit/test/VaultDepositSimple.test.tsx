import { expectSimpleRowText, createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultDeposit from './mock_data/VaultDeposit.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultDeposit: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultDeposit)
    expectSimpleRowText(
      wrapper,
      'vault_id',
      'C70AAB4EB1823B744559AF64D495AD084AC4113C2CFA4F71EB8DD8BB811137C2',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$10.00 USD.rLm1zd4jWxwkoUcvbkRevwt7WC3GffF8B9',
    )
    wrapper.unmount()
  })
})
