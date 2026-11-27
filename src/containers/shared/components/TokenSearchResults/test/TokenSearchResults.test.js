import { render, cleanup, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import testTokens from './mock_data/tokens.json'
import sortedTestTokens from './mock_data/tokens_sorted.json'
import SocketContext from '../../../SocketContext'
import SearchResults from '../TokenSearchResults'
import MockWsClient from '../../../../test/mockWsClient'
import { QuickHarness, flushPromises } from '../../../../test/utils'

const testQuery = 'test'

describe('Testing tokens search', () => {
  let client

  const renderSearchResults = (query = testQuery, response = testTokens) => {
    const searchURL = `/api/v1/tokens/search/${query}`
    moxios.stubRequest(searchURL, {
      status: 200,
      response,
    })
    return render(
      <QuickHarness i18n={i18n}>
        <SocketContext.Provider value={client}>
          <SearchResults
            currentSearchValue={query}
            setCurrentSearchInput={jest.fn()}
          />
        </SocketContext.Provider>
      </QuickHarness>,
    )
  }

  beforeEach(() => {
    moxios.install()
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
    moxios.uninstall()
    cleanup()
  })

  it('renders without crashing', async () => {
    const { container } = renderSearchResults()
    await flushPromises()

    await waitFor(() => {
      expect(container.querySelectorAll('.search-results-menu').length).toEqual(
        1,
      )
    })
  })

  it('renders all tokens ', async () => {
    const { container } = renderSearchResults()
    await flushPromises()

    await waitFor(() => {
      expect(
        container.querySelector('.search-results-menu .search-results-header'),
      ).toBeInTheDocument()
    })

    const searchMenu = container.querySelector('.search-results-menu')

    // SOLO (218547 holders) outranks the mock MPT (10 holders), so it's first
    expect(searchMenu.querySelector('.search-results-header').outerHTML).toBe(
      `<div class="search-results-header">tokens (2)</div>`,
    )
    expect(searchMenu.querySelector('.currency').outerHTML).toBe(
      `<span class="currency" data-testid="currency">SOLO</span>`,
    )
    expect(searchMenu.querySelector('.issuer-name').outerHTML).toBe(
      `<div class="issuer-name">Sologenic (</div>`,
    )
    expect(searchMenu.querySelector('.issuer-address').outerHTML).toBe(
      `<div class="issuer-address truncate">rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz</div>`,
    )
    // type chip + price + holders + trustlines
    expect(
      searchMenu
        .querySelector('.search-result-row')
        .querySelectorAll('.metric-chip').length,
    ).toEqual(4)
    expect(searchMenu.querySelector('.domain').outerHTML).toBe(
      `<a class="domain" rel="noopener noreferrer" target="_blank" href="https://sologenic.com">sologenic.com</a>`,
    )
  })

  it('renders mpts together with tokens in a single list', async () => {
    const { container } = renderSearchResults()
    await flushPromises()

    await waitFor(() => {
      expect(
        container.querySelectorAll('.search-results-header').length,
      ).toEqual(1)
    })

    const header = container.querySelector('.search-results-header')
    expect(header.outerHTML).toBe(
      `<div class="search-results-header">tokens (2)</div>`,
    )

    const rows = container.querySelectorAll('.search-result-row')
    const mptRow = rows[1]
    expect(mptRow.getAttribute('href')).toBe(
      '/mpt/00000001B5F762798A53D543A014CAF8B297CFF8F2F937E8',
    )
    // type chip + holders (no price or trustlines chip, unlike IOUs)
    expect(mptRow.querySelectorAll('.metric-chip').length).toEqual(2)

    // MPTs show ticker + full name, same structure as IOUs
    expect(mptRow.querySelector('.currency').outerHTML).toBe(
      `<span class="currency" data-testid="currency">Example MPT</span>`,
    )
    expect(mptRow.querySelector('.type-chip').textContent).toBe(
      'token_type.mpt',
    )
  })

  it('renders tokens in the exact order the API returns, without re-sorting client-side', async () => {
    // Ranking (by holder count) is the backend's job (see
    // server/routes/v1/tokens.js). This fixture is deliberately NOT
    // pre-sorted by holders, so this test fails if the component ever
    // re-sorts client-side and clobbers that ranking.
    const { container } = renderSearchResults('sort-test', sortedTestTokens)
    await flushPromises()

    await waitFor(() => {
      expect(
        container.querySelectorAll('.search-results-header').length,
      ).toEqual(1)
    })

    const header = container.querySelector('.search-results-header')
    expect(header.outerHTML).toBe(
      `<div class="search-results-header">tokens (12)</div>`,
    )

    const issuerNames = Array.from(
      container.querySelectorAll('.issuer-name'),
    ).map((el) => el.textContent)
    expect(issuerNames).toEqual(
      sortedTestTokens.tokens.map((token) => `${token.issuer_name} (`),
    )
  })
})
