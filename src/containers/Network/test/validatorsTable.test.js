import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { ValidatorsTable } from '../ValidatorsTable'
import validators from './mockValidators.json'
import metrics from './metrics.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderValidatorsTable = (props = {}) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <ValidatorsTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Validators table', () => {
  it('renders without crashing', () => {
    renderValidatorsTable()
  })

  it('renders all parts', () => {
    const tab = 'uptime'
    const { container } = renderValidatorsTable({ validators, metrics, tab })
    expect(container.querySelectorAll('tr').length).toBe(validators.length + 1)
  })

  it('renders uptime tab', () => {
    const tab = 'uptime'
    const { container } = renderValidatorsTable({ validators, metrics, tab })
    expect(container.querySelectorAll('.uptime-tab').length).toBe(1)
    expect(container.querySelector('td.h1').textContent.trim()).toBe('1.00000')
    expect(container.querySelector('td.h24').textContent.trim()).toBe(
      '0.91729*',
    )
    expect(container.querySelector('td.d30').textContent.trim()).toBe(
      '0.98468*',
    )
  })

  it('renders voting tab', () => {
    const tab = 'voting'
    const { container } = renderValidatorsTable({ validators, metrics, tab })
    expect(container.querySelectorAll('.voting-tab').length).toBe(1)
    expect(container.querySelector('td.base').textContent.trim()).toContain(
      '1.00',
    )
    expect(container.querySelector('td.owner').textContent.trim()).toContain(
      '0.20',
    )
    expect(container.querySelector('td.base_fee').textContent.trim()).toContain(
      '0.00001',
    )
  })
})
