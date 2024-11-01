import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { NodesTable } from '../NodesTable'
import nodes from './mockNodes.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderComponent = (props = {}) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <NodesTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Nodes table', () => {
  afterEach(cleanup)
  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent({ nodes })
    expect(screen.getAllByRole('row')).toHaveLength(nodes.length + 1)
  })
})
