import { expectSimpleRowText, createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultClawback from './mock_data/VaultClawback.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultClawback: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultClawback)
    expectSimpleRowText(
      wrapper,
      'vault_id',
      'CFE74C9608553E8BCA771DF600E96937768B9EEA7BAD3AD22BB2793A4494ABF9',
    )
    expectSimpleRowText(wrapper, 'holder', 'raMUwNw4u59UU9WWpqZYYEj77y8yZhC6Wp')
    expectSimpleRowText(
      wrapper,
      'amount',
      '$5.00 USD.rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ',
    )
    wrapper.unmount()
  })
})
