import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import MockWsClient from '../../test/mockWsClient'
import SocketContext, { ExplorerXrplClient } from '../../shared/SocketContext'
import i18n from '../../../i18n/testConfigEnglish'
import NoMatch from '../index'

/* eslint-disable react/jsx-props-no-spreading */
describe('NoMatch container', () => {
  const renderNoMatch = (props = {}) => {
    const client = new MockWsClient() as unknown as ExplorerXrplClient

    return render(
      <I18nextProvider i18n={i18n}>
        <SocketContext.Provider value={client}>
          <HelmetProvider>
            <NoMatch {...props} />
          </HelmetProvider>
        </SocketContext.Provider>
      </I18nextProvider>,
    )
  }

  it('renders without crashing', () => {
    renderNoMatch()
  })

  it('renders default messages and parts', () => {
    const { container } = renderNoMatch()
    expect(screen.getByText('UH-OH!')).toBeInTheDocument()
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(screen.getByText('Please double check your URL')).toBeInTheDocument()
    expect(container.querySelector('.warning')).toBeInTheDocument()
  })

  it('renders correct messages from props', () => {
    const params = {
      title: 'props_title',
      hints: ['props_hint_1', 'props_hint_2'],
    }
    const { container } = renderNoMatch(params)
    expect(screen.getByText('UH-OH!')).toBeInTheDocument()
    expect(screen.getByText('props_title')).toBeInTheDocument()
    const hints = container.querySelectorAll('.hint')
    expect(hints).toHaveLength(2)
    expect(hints[0]).toHaveTextContent('props_hint_1')
    expect(hints[1]).toHaveTextContent('props_hint_2')
    expect(container.querySelector('.warning')).toBeInTheDocument()
  })

  it('does not render warning or uhoh when not an error', () => {
    const params = {
      title: 'props_title',
      hints: ['props_hint_1', 'props_hint_2'],
      isError: false,
    }
    const { container } = renderNoMatch(params)
    expect(container.querySelector('.uh-oh')).not.toBeInTheDocument()
    expect(screen.getByText('props_title')).toBeInTheDocument()
    const hints = container.querySelectorAll('.hint')
    expect(hints).toHaveLength(2)
    expect(hints[0]).toHaveTextContent('props_hint_1')
    expect(hints[1]).toHaveTextContent('props_hint_2')
    expect(container.querySelector('.warning')).not.toBeInTheDocument()
  })

  it('renders custom warning', () => {
    const params = {
      title: 'props_title',
      hints: ['props_hint_1', 'props_hint_2'],
      warning: 'be_warned',
    }
    renderNoMatch(params)
    expect(screen.getByText('be_warned')).toBeInTheDocument()
  })

  it('renders connection state', () => {
    i18n.addResource(
      'en-US',
      'test',
      'hint_test',
      'Version: {{connection.server.version}}',
    )
    const params = {
      title: 'props_title',
      hints: ['test:hint_test'],
    }
    renderNoMatch(params)
    expect(screen.getByText('Version: 1.9.4')).toBeInTheDocument()
  })
})
