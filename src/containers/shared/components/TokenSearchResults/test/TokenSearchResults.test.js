import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import { QueryClientProvider } from 'react-query'
import moxios from 'moxios'
import i18n from '../../../../../i18n/testConfig'
import testTokens from './mock_data/tokens.json'
import SocketContext from '../../../SocketContext'
import SearchResults from '../TokenSearchResults'
import MockWsClient from '../../../../test/mockWsClient'
import { testQueryClient } from '../../../../test/QueryClient'

const testQuery = 'test'

describe('Testing tokens search', () => {
  let client
  let wrapper

  const createWrapper = () => {
    const searchURL = `/api/v1/tokens/search/${testQuery}`
    moxios.stubRequest(searchURL, {
      status: 200,
      response: testTokens,
    })
    return mount(
      <I18nextProvider i18n={i18n}>
        <SocketContext.Provider value={client}>
          <QueryClientProvider client={testQueryClient}>
            <HelmetProvider>
              <MemoryRouter>
                <SearchResults
                  currentSearchValue={testQuery}
                  setCurrentSearchInput={jest.fn()}
                />
              </MemoryRouter>
            </HelmetProvider>
          </QueryClientProvider>
        </SocketContext.Provider>
      </I18nextProvider>,
    )
  }

  beforeEach(() => {
    moxios.install()
    client = new MockWsClient()
    wrapper = createWrapper()
  })

  afterEach(() => {
    client.close()
    moxios.uninstall()
    wrapper.unmount()
  })

  it('renders without crashing', () => {
    wrapper.update()
    const searchMenu = wrapper.find('.search-results-menu')
    expect(searchMenu.length).toEqual(1)
  })

  it('renders all tokens ', () => {
    wrapper.update()
    const searchMenu = wrapper.find('.search-results-menu')

    expect(searchMenu.find('.search-results-header').at(0).html()).toEqual(
      `<div class="search-results-header">tokens (1)</div>`,
    )
    expect(searchMenu.find('.currency').at(0).html()).toEqual(
      `<span class="currency">SOLO</span>`,
    )
    expect(searchMenu.find('.issuer-name').at(0).html()).toEqual(
      `<div class="issuer-name">Sologenic (</div>`,
    )
    expect(searchMenu.find('.issuer-address').at(0).html()).toEqual(
      `<div class="issuer-address truncate">rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz</div>`,
    )
    expect(
      searchMenu.find('.search-result-row').at(0).find('.metric-chip').length,
    ).toEqual(3)
    expect(searchMenu.find('.domain').at(0).html()).toEqual(
      `<a class="domain" rel="noopener noreferrer" target="_blank" href="https://sologenic.com">sologenic.com</a>`,
    )
  })
})
