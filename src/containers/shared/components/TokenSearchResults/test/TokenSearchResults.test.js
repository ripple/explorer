import { render, cleanup, waitFor } from '@testing-library/react'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import testTokens from './mock_data/tokens.json'
import SocketContext from '../../../SocketContext'
import SearchResults from '../TokenSearchResults'
import MockWsClient from '../../../../test/mockWsClient'
import { QuickHarness, flushPromises } from '../../../../test/utils'

const testQuery = 'test'

describe('Testing tokens search', () => {
  let client

  const renderSearchResults = () => {
    const searchURL = `/api/v1/tokens/search/${testQuery}`
    moxios.stubRequest(searchURL, {
      status: 200,
      response: testTokens,
    })
    return render(
      <QuickHarness i18n={i18n}>
        <SocketContext.Provider value={client}>
          <SearchResults
            currentSearchValue={testQuery}
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

    const searchMenu = container.querySelectorAll('.search-results-menu')
    expect(searchMenu.length).toEqual(1)
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

    expect(searchMenu.querySelector('.search-results-header').outerHTML).toBe(
      `<div class="search-results-header">tokens (1)</div>`,
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
    expect(
      searchMenu
        .querySelector('.search-result-row')
        .querySelectorAll('.metric-chip').length,
    ).toEqual(3)
    expect(searchMenu.querySelector('.domain').outerHTML).toBe(
      `<a class="domain" rel="noopener noreferrer" target="_blank" href="https://sologenic.com">sologenic.com</a>`,
    )
  })
})
