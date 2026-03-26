import { render, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { Header } from '../index'
import { queryClient } from '../../shared/QueryClient'

describe('Header component', () => {
  let client: MockWsClient

  const renderHeader = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client as any}>
            <QueryClientProvider client={queryClient}>
              <Header />
            </QueryClientProvider>
          </SocketContext.Provider>
        </Router>
      </I18nextProvider>,
    )

  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
    cleanup()
  })

  it('renders without crashing', () => {
    renderHeader()
  })

  it('renders all parts', () => {
    const { container } = renderHeader()
    expect(container.querySelectorAll('.search').length).toEqual(1)
    expect(container.querySelectorAll('.navbar-brand').length).toEqual(1)
    expect(container.querySelectorAll('.network').length).toEqual(1)
  })
})
