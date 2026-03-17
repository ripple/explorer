import { render, waitFor, fireEvent } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import { Vaults } from '..'
import NetworkContext from '../../shared/NetworkContext'
import { flushPromises, QuickHarness } from '../../test/utils'
import vaultsData from './mock_data/vaults.json'
import aggregateStats from './mock_data/aggregate_stats.json'
import { VAULTS_ROUTE } from '../../App/routes'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

jest.mock('../../shared/hooks/useXRPToUSDRate', () => ({
  useXRPToUSDRate: () => 2.0,
}))

describe('Vaults Page container', () => {
  const renderVaults = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/vaults']}>
          <Route path={VAULTS_ROUTE.path} element={<Vaults />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  const stubVaultsApis = () => {
    moxios.stubRequest('/api/v1/vaults/aggregate-statistics', {
      status: 200,
      response: aggregateStats,
    })
    moxios.stubRequest(/\/api\/v1\/vaults\?/, {
      status: 200,
      response: vaultsData,
    })
  }

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    moxios.uninstall()
    process.env = oldEnvs
  })

  it('renders without crashing', () => {
    renderVaults()
  })

  it('renders all parts', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelectorAll('.vaults-page').length).toBe(1)
    })

    // Metrics (xrpToUSDRate = 2.0)
    const metrics = container.querySelectorAll('.metric')
    expect(metrics.length).toBe(6)

    // TVL: 8,000,000 * 2 = $16.0M
    expect(metrics[0].querySelector('.title')?.textContent).toContain(
      'Total Value Locked (TVL)',
    )
    expect(metrics[0].querySelector('.val')?.textContent).toContain('$16.0M')

    // Outstanding Loans: 3,700,000 * 2 = $7.4M
    expect(metrics[1].querySelector('.title')?.textContent).toContain(
      'Outstanding Loans',
    )
    expect(metrics[1].querySelector('.val')?.textContent).toContain('$7.4M')

    // Loans Originated: 15,000,000 * 2 = $30.0M
    expect(metrics[2].querySelector('.title')?.textContent).toContain(
      'Loans Originated',
    )
    expect(metrics[2].querySelector('.val')?.textContent).toContain('$30.0M')

    // Avg Interest Rate: 4.50%
    expect(metrics[3].querySelector('.title')?.textContent).toContain(
      'Avg. Interest Rate',
    )
    expect(metrics[3].querySelector('.val')?.textContent).toContain('4.50%')

    // # of Vaults: 42
    expect(metrics[4].querySelector('.title')?.textContent).toContain(
      '# of Vaults',
    )
    expect(metrics[4].querySelector('.val')?.textContent).toContain('42')

    // Utilization Ratio: 0.4625 * 100 = 46.3%
    expect(metrics[5].querySelector('.title')?.textContent).toContain(
      'Utilization Ratio',
    )
    expect(metrics[5].querySelector('.val')?.textContent).toContain('46.3%')

    // Filters
    const filters = container.querySelectorAll('.filter-field')
    expect(filters.length).toBe(3)

    expect(filters[0].querySelector('.filter-label')?.textContent).toContain(
      'All Assets',
    )
    expect(filters[1].querySelector('.filter-label')?.textContent).toContain(
      'XRP',
    )
    expect(filters[2].querySelector('.filter-label')?.textContent).toContain(
      'Stablecoins',
    )

    // Vaults Table
    expect(container.querySelectorAll('.vaults-table').length).toBe(1)

    // Table Headers
    expect(container.querySelector('th.rank')?.textContent).toContain('#')
    expect(container.querySelector('th.vault-id')?.textContent).toContain(
      'Vault ID',
    )
    expect(container.querySelector('th.name-col')?.textContent).toContain(
      'name',
    )
    expect(container.querySelector('th.asset')?.textContent).toContain('Asset')
    expect(container.querySelector('th.tvl_usd')?.textContent).toContain(
      'TVL (USD)',
    )
    expect(
      container.querySelector('th.outstanding_loans_usd')?.textContent,
    ).toContain('Outstanding Loans')
    expect(
      container.querySelector('th.utilization_ratio')?.textContent,
    ).toContain('Utilization Ratio')
    expect(
      container.querySelector('th.avg_interest_rate')?.textContent,
    ).toContain('Avg. Interest Rate')
    expect(container.querySelector('th.website')?.textContent).toContain(
      'Website',
    )

    // Table Rows (excluding header)
    const rows = Array.from(container.querySelectorAll('tr')).filter(
      (row) => !row.querySelector('th'),
    )
    expect(rows).toHaveLength(2)

    // Row 1: XRP vault (asset_currency = XRP, so TVL = 5,000,000 * 2 = $10.0M)
    const firstRow = rows[0]
    expect(firstRow.querySelector('td.rank')?.textContent).toContain('1')
    expect(firstRow.querySelector('td.name')?.textContent).toContain(
      'XRP Lending Vault',
    )
    expect(firstRow.querySelector('td.asset')?.textContent).toContain('XRP')
    expect(firstRow.querySelector('td.tvl')?.textContent).toContain('$10.0M')
    expect(
      firstRow.querySelector('td.outstanding-loans')?.textContent,
    ).toContain('$5.0M')
    expect(firstRow.querySelector('td.utilization')?.textContent).toContain(
      '50.00%',
    )
    expect(firstRow.querySelector('td.interest-rate')?.textContent).toContain(
      '5.25%',
    )

    // Row 2: RLUSD vault (non-XRP, so TVL stays $3.0M)
    const secondRow = rows[1]
    expect(secondRow.querySelector('td.rank')?.textContent).toContain('2')
    expect(secondRow.querySelector('td.name')?.textContent).toContain(
      'RLUSD Stable Vault',
    )
    expect(secondRow.querySelector('td.asset')?.textContent).toContain(
      'Ripple',
    )
    expect(secondRow.querySelector('td.tvl')?.textContent).toContain('$3.0M')
    expect(
      secondRow.querySelector('td.outstanding-loans')?.textContent,
    ).toContain('$1.2M')
    expect(secondRow.querySelector('td.utilization')?.textContent).toContain(
      '40.00%',
    )
    expect(secondRow.querySelector('td.interest-rate')?.textContent).toContain(
      '3.75%',
    )
  })

  it('renders search bar', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.search-bar')).toBeTruthy()
    })

    const input = container.querySelector(
      '.search-bar input',
    ) as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.placeholder).toContain(
      'Search Accounts, Vault Names, Assets, Websites',
    )
  })

  it('renders empty state when no vaults returned', async () => {
    moxios.stubRequest('/api/v1/vaults/aggregate-statistics', {
      status: 200,
      response: aggregateStats,
    })
    moxios.stubRequest(/\/api\/v1\/vaults\?/, {
      status: 200,
      response: { ...vaultsData, total: 0, results: [] },
    })
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.empty-message')?.textContent).toContain(
        'No vaults found.',
      )
    })
  })

  it('toggles filter selection', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelectorAll('.filter-field').length).toBe(3)
    })

    const xrpFilter = container.querySelectorAll('.filter-field')[1]
    fireEvent.click(xrpFilter)

    expect(xrpFilter.classList.contains('selected')).toBe(true)

    // Clicking the same filter again deselects it
    fireEvent.click(xrpFilter)
    expect(xrpFilter.classList.contains('selected')).toBe(false)
  })

  it('renders refresh button', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.refresh-button')).toBeTruthy()
    })
  })

  it('renders pagination', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.vaults-page')).toBeTruthy()
    })

    // Pagination component should be rendered (with only 2 items and pageSize 20,
    // pagination may render but with limited controls)
    expect(container.querySelector('.vaults-table-section')).toBeTruthy()
  })

  it('renders disclaimer footnote', async () => {
    stubVaultsApis()
    const { container } = renderVaults()
    await flushPromises()
    await waitFor(() => {
      expect(container.querySelector('.footnote')).toBeTruthy()
    })
    expect(container.querySelector('.footnote')?.textContent).toContain(
      'Trust Level 3',
    )
  })
})
