import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { SimpleTab } from '../SimpleTab'
import {
  expectSimpleRowLabel,
  expectSimpleRowText,
} from '../../shared/components/Transaction/test'
import i18n from '../../../i18n/testConfigEnglish'
import validator from './mock_data/validator.json'

describe('SimpleTab container', () => {
  const renderComponent = (width = 1200) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SimpleTab data={validator} width={width} />
        </Router>
      </I18nextProvider>,
    )

  afterEach(cleanup)

  it('renders simple tab information', () => {
    renderComponent()
    expect(screen.queryByTestId('simple-body')).toBeDefined()
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expectSimpleRowText(screen, 'version', '1.9.4')
    expectSimpleRowLabel(screen, 'ledger-time', 'Last Ledger Date/Time (UTC)')
    expectSimpleRowText(screen, 'ledger-time', '5/28/2020, 9:21:19 AM')
    expectSimpleRowLabel(screen, 'ledger-index', 'Last Ledger Index')
    expectSimpleRowText(screen, 'ledger-index', '55764842')
    expectSimpleRowLabel(screen, 'unl', 'UNL')
    expectSimpleRowText(screen, 'unl', ' vl.ripple.com')
    expectSimpleRowLabel(screen, 'score-h1', 'Agreement (1 hour)')
    expectSimpleRowText(screen, 'score-h1', '1.00000')
    expectSimpleRowLabel(screen, 'score-h24', 'Agreement (24 hours)')
    expectSimpleRowText(screen, 'score-h24', '1.00000*')
    expectSimpleRowLabel(screen, 'score-d30', 'Agreement (30 days)')
    expectSimpleRowText(screen, 'score-d30', '0.99844*')
  })

  it('renders index row instead of index cart in width smaller than 900', () => {
    renderComponent(800)
    expect(screen.queryByTestId('simple-body')).toBeDefined()
    expect(screen.queryByTestId('index')).toBeNull()
  })
})
