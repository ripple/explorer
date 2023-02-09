import i18n from '../../../../../../i18nTestConfig.en-US'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'

import { Simple } from '../Simple'
import mockUNLModifyEnable from './mock_data/UNLModifyEnable.json'
import mockUNLModifyDisable from './mock_data/UNLModifyDisable.json'

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

describe('UNLModify: Simple', () => {
  it('renders tx that enables a validator', () => {
    const wrapper = createWrapper(mockUNLModifyEnable)
    expectSimpleRowLabel(wrapper, 'validator', 'validator')
    expectSimpleRowText(
      wrapper,
      'validator',
      'nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw',
    )
    expectSimpleRowLabel(wrapper, 'action', 'action')
    expectSimpleRowText(wrapper, 'action', 'ENABLE')
    wrapper.unmount()
  })

  it('renders tx that disables a validator', () => {
    const wrapper = createWrapper(mockUNLModifyDisable)
    expectSimpleRowLabel(wrapper, 'validator', 'validator')
    expectSimpleRowText(
      wrapper,
      'validator',
      'nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw',
    )
    expectSimpleRowLabel(wrapper, 'action', 'action')
    expectSimpleRowText(wrapper, 'action', 'DISABLE')
    wrapper.unmount()
  })
})
