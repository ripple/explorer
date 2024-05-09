import { mount } from 'enzyme'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

import { Simple } from '../Simple'
import mockUNLModifyEnable from './mock_data/UNLModifyEnable.json'
import mockUNLModifyDisable from './mock_data/UNLModifyDisable.json'
import { SimpleTab } from '../../../../../Transactions/SimpleTab'
import { QuickHarness } from '../../../../../test/utils'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'

const createWrapper = createSimpleRenderFactory(Simple, i18n)

describe('UNLModify: Simple', () => {
  it('renders tx that enables a validator', () => {
    const wrapper = createWrapper(mockUNLModifyEnable)
    expectSimpleRowLabel(wrapper, 'validator', 'Validator')
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
    expectSimpleRowLabel(wrapper, 'validator', 'Validator')
    expectSimpleRowText(
      wrapper,
      'validator',
      'nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw',
    )
    expectSimpleRowLabel(wrapper, 'action', 'action')
    expectSimpleRowText(wrapper, 'action', 'DISABLE')
    wrapper.unmount()
  })

  it('renders tx with correct account and sequence', () => {
    const wrapper = mount(
      <QuickHarness i18n={i18n}>
        <SimpleTab
          data={{
            processed: mockUNLModifyDisable,
            summary: summarizeTransaction(mockUNLModifyDisable, true).details,
          }}
          width={800}
        />
      </QuickHarness>,
    )
    expect(wrapper.find('[data-testid="account"]')).not.toExist()
    expectSimpleRowLabel(wrapper, 'sequence', 'Sequence Number')
    expectSimpleRowText(wrapper, 'sequence', '0')

    wrapper.unmount()
  })
})
