import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { Settings } from '../Settings'
import i18n from '../../../../i18n/testConfig'

describe('MPT Settings container', () => {
  const flags = ['lsfMPTCanClawback', 'lsfMPTCanTransfer']

  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Settings flags={flags} />
      </I18nextProvider>,
    )

  afterEach(cleanup)

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders defined fields', () => {
    renderComponent()
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(7)

    expect(rows[0].outerHTML).toBe(
      '<tr class="row"><td class="col1">locked</td><td class="col2">disabled</td></tr>',
    )
    expect(rows[1].outerHTML).toBe(
      '<tr class="row"><td class="col1">can_lock</td><td class="col2">disabled</td></tr>',
    )
    expect(rows[2].outerHTML).toBe(
      '<tr class="row"><td class="col1">require_auth</td><td class="col2">disabled</td></tr>',
    )
    expect(rows[3].outerHTML).toBe(
      '<tr class="row"><td class="col1">can_escrow</td><td class="col2">disabled</td></tr>',
    )
    expect(rows[4].outerHTML).toBe(
      '<tr class="row"><td class="col1">can_trade</td><td class="col2">disabled</td></tr>',
    )
    expect(rows[5].outerHTML).toBe(
      '<tr class="row"><td class="col1">can_transfer</td><td class="col2">enabled</td></tr>',
    )
    expect(rows[6].outerHTML).toBe(
      '<tr class="row"><td class="col1">can_clawback</td><td class="col2">enabled</td></tr>',
    )
  })
})
