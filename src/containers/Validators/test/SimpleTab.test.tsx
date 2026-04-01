import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { SimpleTab } from '../SimpleTab'
import {
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../shared/components/Transaction/test'
import i18n from '../../../i18n/testConfigEnglish'
import validator from './mock_data/validator.json'
import { V7_FUTURE_ROUTER_FLAGS } from '../../test/utils'

describe('SimpleTab container', () => {
  const renderSimpleTab = (width = 1200) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router future={V7_FUTURE_ROUTER_FLAGS}>
          <SimpleTab data={validator} width={width} />
        </Router>
      </I18nextProvider>,
    )

  it('renders simple tab information', () => {
    const { container } = renderSimpleTab()
    expect(container.querySelectorAll('.simple-body').length).toBe(1)
    expect(container.querySelectorAll('a').length).toBe(2)
    expectSimpleRowText(container, 'version', '1.9.4')
    expectSimpleRowLabel(
      container,
      'ledger-time',
      'Last Ledger Date/Time (UTC)',
    )
    expectSimpleRowText(container, 'ledger-time', '5/28/2020, 9:21:19 AM')
    expectSimpleRowLabel(container, 'ledger-index', 'Last Ledger Index')
    expectSimpleRowText(container, 'ledger-index', '55764842')
    expectSimpleRowLabel(container, '.unl', 'UNL')
    expectSimpleRowText(container, '.unl', 'vl.ripple.com')
    expectSimpleRowLabel(container, 'score-h1', 'Agreement (1 hour)')
    expectSimpleRowText(container, 'score-h1', '1.00000')
    expectSimpleRowLabel(container, 'score-h24', 'Agreement (24 hours)')
    expectSimpleRowText(container, 'score-h24', '1.00000*')
    expectSimpleRowLabel(container, 'score-d30', 'Agreement (30 days)')
    expectSimpleRowText(container, 'score-d30', '0.99844*')
  })

  it('renders index row instead of index cart in width smaller than 900', () => {
    const { container } = renderSimpleTab(800)
    expect(container.querySelectorAll('.simple-body').length).toBe(1)
    expect(container.querySelectorAll('.index').length).toBe(0)
  })
})
