import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { Details } from '../Details'
import i18n from '../../../../i18n/testConfig'

describe('MPT Details container', () => {
  const dataDefault = {
    issuer: 'r3SnSE9frruxwsC9qGHFiUJShda62fNFGQ',
    assetScale: 2,
    maxAmt: '256',
    outstandingAmt: '64',
    transferFee: 3,
    sequence: 3949,
    metadata: 'https://www.google.com/',
    flags: ['lsfMPTCanClawback', 'lsfMPTCanTransfer'],
  }

  const renderComponent = (data = dataDefault) =>
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Details data={data} />
        </BrowserRouter>
      </I18nextProvider>,
    )

  afterEach(cleanup)
  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders defined fields', () => {
    renderComponent()
    const rows = screen.getAllByTitle('row')
    expect(rows).toHaveLength(6)

    expect(rows[0].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">asset_scale</td><td class="col2">2</td></tr>',
    )
    expect(rows[1].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">max_amount</td><td class="col2">256</td></tr>',
    )
    expect(rows[2].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">outstanding_amount</td><td class="col2">64</td></tr>',
    )
    expect(rows[3].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">transfer_fee</td><td class="col2">0.003%</td></tr>',
    )
    expect(rows[4].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">sequence_number_short</td><td class="col2">3949</td></tr>',
    )
    expect(rows[5].outerHTML).toBe(
      '<tr class="row" title="row"><td class="col1">metadata</td><td class="col2">https://www.google.com/</td></tr>',
    )
  })
})
