import { render, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import { Tokens } from '..'
import NetworkContext from '../../shared/NetworkContext'
import { flushPromises, QuickHarness } from '../../test/utils'
import tokensData from './mock_data/tokens.json'
import { TOKENS_ROUTE } from '../../App/routes'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Tokens Page container', () => {
  const renderTokens = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/tokens']}>
          <Route path={TOKENS_ROUTE.path} element={<Tokens />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    moxios.uninstall()
    process.env = oldEnvs
  })

  it('renders without crashing', () => {
    renderTokens()
  })

  it('renders all parts', async () => {
    moxios.stubRequest('/api/v1/tokens', {
      status: 200,
      response: tokensData,
    })
    const { container } = renderTokens()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelectorAll('.tokens-page').length).toBe(1)
    })

    // Metrics
    const metrics = container.querySelectorAll('.metric')

    expect(metrics.length).toBe(4)

    expect(metrics[0].querySelector('.title')?.textContent).toContain(
      '# of Tokens',
    )
    expect(metrics[0].querySelector('.val')?.textContent).toContain('2')

    expect(metrics[1].querySelector('.title')?.textContent).toContain(
      'Market Cap',
    )
    expect(metrics[1].querySelector('.val')?.textContent).toContain('$152.1M')

    expect(metrics[2].querySelector('.title')?.textContent).toContain(
      'DEX Traded Volume (24H)',
    )
    expect(metrics[2].querySelector('.val')?.textContent).toContain('$1.0M')

    expect(metrics[3].querySelector('.title')?.textContent).toContain(
      'Stablecoin',
    )
    expect(metrics[3].querySelector('.val')?.textContent).toContain('$25.9M')

    // Filter
    const filters = container.querySelectorAll('.filter-field')

    expect(filters.length).toBe(2)

    expect(filters[0].querySelector('.filter-label')?.textContent).toContain(
      'Stablecoin',
    )

    expect(filters[1].querySelector('.filter-label')?.textContent).toContain(
      'Wrapped',
    )

    // Tokens Table
    expect(container.querySelectorAll('.tokens-table').length).toBe(1)

    // Table Headers
    expect(container.querySelector('th.count')?.textContent).toContain('#')
    expect(container.querySelector('th.name-col')?.textContent).toContain(
      'name',
    )
    expect(container.querySelector('th.issuer')?.textContent).toContain(
      'Issuer',
    )
    expect(container.querySelector('th.price')?.textContent).toContain('Price')
    expect(container.querySelector('th.volume')?.textContent).toContain(
      'Volume',
    )
    expect(container.querySelector('th.trades')?.textContent).toContain(
      'Trades',
    )
    expect(container.querySelector('th.holders')?.textContent).toContain(
      'Holders',
    )
    expect(container.querySelector('th.tvl')?.textContent).toContain('TVL')
    expect(container.querySelector('th.market_cap')?.textContent).toContain(
      'Market Cap',
    )

    // Table Rows
    // find all table rows excluding header
    const rows = Array.from(container.querySelectorAll('tr')).filter(
      (row) => !row.querySelector('th'),
    )
    expect(rows).toHaveLength(2)

    const firstRow = rows[0]
    expect(firstRow.querySelector('td.count')?.textContent).toContain('1')
    expect(firstRow.querySelector('td.name')?.textContent).toContain('SOLO')
    expect(firstRow.querySelector('td.issuer')?.textContent).toContain(
      'Sologenic',
    )
    expect(firstRow.querySelector('td.price')?.textContent).toContain('$0.2')
    expect(firstRow.querySelector('td.volume')?.textContent).toContain(
      '$138.7K',
    )
    expect(firstRow.querySelector('td.trades')?.textContent).toContain('1,847')
    expect(firstRow.querySelector('td.holders')?.textContent).toContain(
      '218.1K',
    )
    expect(firstRow.querySelector('td.tvl')?.textContent).toContain('$1.1M')
    expect(firstRow.querySelector('td.market-cap')?.textContent).toContain(
      '$91.2M',
    )
  })
})
