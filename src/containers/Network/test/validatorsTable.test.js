import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { ValidatorsTable } from '../ValidatorsTable'
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
    const tab = 'uptime'
    renderComponent({ validators, metrics, tab })
    expect(screen.getAllByRole('row')).toHaveLength(validators.length + 1)
  })

  it('renders uptime tab', () => {
    const tab = 'uptime'
    renderComponent({ validators, metrics, tab })
    expect(screen.find('.uptime-tab').length).toBe(1)
    expect(screen.find('td.h1').at(0).text().trim()).toBe('1.00000')
    expect(screen.find('td.h24').at(0).text().trim()).toBe('0.91729*')
    expect(screen.find('td.d30').at(0).text().trim()).toBe('0.98468*')
  })

  it('renders voting tab', () => {
    const tab = 'voting'
    renderComponent({ validators, metrics, tab })
    expect(screen.find('.voting-tab').length).toBe(1)
    expect(screen.find('td.base').at(0).text().trim()).toContain('1.00')
    expect(screen.find('td.owner').at(0).text().trim()).toContain('0.20')
    expect(screen.find('td.base_fee').at(0).text().trim()).toContain('0.00001')
  })
})
