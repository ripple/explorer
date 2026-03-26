import {
  expectSimpleRowText,
  createSimpleRenderFactory,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import mockVaultSet from './mock_data/VaultSet.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('VaultSet: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultSet)
    expectSimpleRowText(
      container,
      'vault_id',
      '47148BAF6D14F8456F859A4DFCF2B2921512E44C5E1EADD72D34F33F6ED2AA00',
    )
    expectSimpleRowText(container, 'assets_maximum', '1000')
    expectSimpleRowText(container, 'data', '75706461746564206D65746164617461')
    expectSimpleRowNotToExist(container, 'domain_id')
    unmount()
  })
})
