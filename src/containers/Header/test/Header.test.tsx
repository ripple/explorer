import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../i18n/testConfigEnglish'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { Header } from '../index'

describe('Header component', () => {
  let client
  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client}>
            <Header />
          </SocketContext.Provider>
        </Router>
      </I18nextProvider>,
    )

  beforeEach(() => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.search').length).toEqual(1)
    expect(wrapper.find('.navbar-brand').hostNodes().length).toEqual(1)
    expect(wrapper.find('.network').hostNodes().length).toEqual(1)
    wrapper.unmount()
  })
})
