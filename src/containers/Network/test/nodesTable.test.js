import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18nTestConfig'
import NodesTable from '../NodesTable'
import nodes from './mockNodes.json'

/* eslint-disable react/jsx-props-no-spreading */
const createWrapper = (props = {}) =>
  mount(
    <Router>
      <I18nextProvider i18n={i18n}>
        <NodesTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Nodes table', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper({ nodes })
    expect(wrapper.find('tr').length).toBe(nodes.length + 1)
    wrapper.unmount()
  })
})
