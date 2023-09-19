import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowText } from '../../test'

import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockAMMDelete from './mock_data/AMMDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

describe('AMMDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockAMMDelete) // TOOD: - Make this look up asset 1 / asset 2 currency codes
    expectSimpleRowText(wrapper, 'asset1', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'asset2',
      'FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    wrapper.unmount()
  })
})
