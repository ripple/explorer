import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { TransactionDescription } from '../Description'

describe('Description container', () => {
  const createWrapper = (data = {}) =>
    mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <TransactionDescription data={data} />
        </I18nextProvider>
      </Router>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })
})
