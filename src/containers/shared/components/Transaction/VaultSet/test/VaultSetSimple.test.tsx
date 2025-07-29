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
      'vault_id',
      '47148BAF6D14F8456F859A4DFCF2B2921512E44C5E1EADD72D34F33F6ED2AA00',
    )
    expectSimpleRowText(wrapper, 'assets_maximum', '0.001 XRP')
    expectSimpleRowText(wrapper, 'data', '75706461746564206D65746164617461')
    expectSimpleRowNotToExist(wrapper, 'domain_id')
    wrapper.unmount()
  })
})
