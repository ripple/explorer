import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { NodesTable } from '../NodesTable'
import nodes from './mockNodes.json'

/* eslint-disable react/jsx-props-no-spreading */
const renderNodesTable = (props = {}) =>
  render(
    <Router>
      <I18nextProvider i18n={i18n}>
        <NodesTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Nodes table', () => {
  it('renders without crashing', () => {
    renderNodesTable()
  })

  it('renders all parts', () => {
    const { container } = renderNodesTable({ nodes })
    expect(container.querySelectorAll('tr').length).toBe(nodes.length + 1)
  })
})
