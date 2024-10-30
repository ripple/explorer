import { render, screen, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { Header } from '../index'
import { queryClient } from '../../shared/QueryClient'

describe('Header component', () => {
  let client
  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client}>
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
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent()
    expect(screen.queryAllByTestId('search')).toHaveLength(1)
    expect(screen.queryAllByTestId('navbar-brand')).toHaveLength(1)
    expect(screen.queryAllByTestId('dropdown')).toHaveLength(3)
  })
})
