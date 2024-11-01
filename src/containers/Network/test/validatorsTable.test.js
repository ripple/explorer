import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import ValidatorsTable from '../ValidatorsTable'
import validators from './mockValidators.json'
import metrics from './metrics.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderComponent = (props = {}) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <ValidatorsTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Validators table', () => {
  afterEach(cleanup)
  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent({ validators, metrics })
    expect(screen.getAllByRole('row')).toHaveLength(validators.length + 1)
  })
})
