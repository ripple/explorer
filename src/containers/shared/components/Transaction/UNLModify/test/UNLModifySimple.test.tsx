import { render } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

import { Simple } from '../Simple'
import mockUNLModifyEnable from './mock_data/UNLModifyEnable.json'
import mockUNLModifyDisable from './mock_data/UNLModifyDisable.json'
import { SimpleTab } from '../../../../../Transactions/SimpleTab'
import { QuickHarness } from '../../../../../test/utils'
import summarizeTransaction from '../../../../../../rippled/lib/txSummary'

const renderSimple = createSimpleRenderFactory(Simple, i18n)

describe('UNLModify: Simple', () => {
  it('renders tx that enables a validator', () => {
    const { container } = renderSimple(mockUNLModifyEnable)
    expectSimpleRowLabel(container, 'validator', 'Validator')
    expectSimpleRowText(
      container,
      'validator',
      'nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw',
    )
    expectSimpleRowLabel(container, 'action', 'action')
    expectSimpleRowText(container, 'action', 'ENABLE')
  })

  it('renders tx that disables a validator', () => {
    const { container } = renderSimple(mockUNLModifyDisable)
    expectSimpleRowLabel(container, 'validator', 'Validator')
    expectSimpleRowText(
      container,
      'validator',
      'nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw',
    )
    expectSimpleRowLabel(container, 'action', 'action')
    expectSimpleRowText(container, 'action', 'DISABLE')
  })

  it('renders tx with correct account and sequence', () => {
    const { container } = render(
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
    expect(
      container.querySelector('[data-testid="account"]'),
    ).not.toBeInTheDocument()
    expectSimpleRowLabel(container, 'sequence', 'Sequence Number')
    expectSimpleRowText(container, 'sequence', '0')
  })
})
