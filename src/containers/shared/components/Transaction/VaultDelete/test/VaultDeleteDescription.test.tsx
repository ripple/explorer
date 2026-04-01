import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultDelete.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('VaultDelete: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expect(container).toHaveTextContent(
      'rLR12AgChXxLoQsuLCizNCgh5pt5jPheo1 deleted a vault with ID 2AA88C4CA646645E35E38B8D51CD2CA50BDE14A3F3FFE3838F2C8DCE95C2BABD',
    )
    unmount()
  })
})
