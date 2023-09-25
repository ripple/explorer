import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { AmendmentsTable } from '../AmendmentsTable'
import amendments from './mockAmendmentsProcessed.json'

/* eslint-disable react/jsx-props-no-spreading */
const createWrapper = (props = {}) =>
  mount(
    <Router>
      <I18nextProvider i18n={i18n}>
        <AmendmentsTable {...props} />
      </I18nextProvider>
    </Router>,
  )

describe('Amendments table', () => {
  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper({ amendments })
    expect(wrapper.find('tr').length).toBe(amendments.length + 1)
    wrapper.unmount()
  })
})
