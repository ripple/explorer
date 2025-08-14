import { expectSimpleRowText, createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultWithdraw from './mock_data/VaultWithdraw.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultWithdraw: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultWithdraw)
    expectSimpleRowText(
      wrapper,
      'vault_id',
      'FCC4FB21E6F5B3E60661730C7F6F13A100E1E89FF4CF854D9A9B2F3DF967FD77',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$5.00 USD.rMab3itPzruo5HLEVherc93Prf4tg5d7dx',
    )
    wrapper.unmount()
  })
})
