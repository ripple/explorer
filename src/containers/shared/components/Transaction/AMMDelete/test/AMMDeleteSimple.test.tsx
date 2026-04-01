import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowText } from '../../test'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMDelete from './mock_data/AMMDelete.json'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('AMMDelete: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockAMMDelete) // TOOD: - Make this look up asset 1 / asset 2 currency codes
    expectSimpleRowText(container, 'asset1', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      'FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    unmount()
  })
})
