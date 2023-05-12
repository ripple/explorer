import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import SocketContext from '../../../shared/SocketContext'
import { NetworkPicker } from '../NetworkPicker'
import MockWsClient from '../../../test/mockWsClient'

describe('NetworkPicker component', () => {
  let client
  const { location } = window
  const mockedFunction = jest.fn()
  const oldEnvs = process.env

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client}>
            <NetworkPicker />
          </SocketContext.Provider>
        </Router>
      </I18nextProvider>,
    )

  beforeEach(() => {
    // @ts-ignore -- typescript does not like mocking window
    delete window.location
    // @ts-ignore -- typescript does not like mocking window
    window.location = { assign: mockedFunction }
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
    window.location = location
    process.env = oldEnvs
  })

  it('dropdown expands', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.network .dropdown')).toExist()
    expect(wrapper.find('.network .dropdown')).not.toHaveClassName(
      '.dropdown-expanded',
    )

    wrapper.find('.network .dropdown-toggle').simulate('click')
    expect(wrapper.find('.network .dropdown')).toHaveClassName(
      '.dropdown-expanded',
    )
    wrapper.unmount()
  })

  it('direct to other networks', () => {
    const wrapper = createWrapper()

    // expand dropdown
    expect(wrapper.find('.network .dropdown')).toExist()
    wrapper.find('.network .dropdown-toggle').simulate('click')
    expect(wrapper.find('.dropdown-item.mainnet')).not.toExist() // don't show the current network
    expect(wrapper.find('.dropdown-item.testnet')).toExist()

    // test clicking on testnet
    wrapper.find('.dropdown-item.testnet').simulate('click')
    expect(wrapper.find('.dropdown-item.testnet')).toHaveProp(
      'href',
      process.env.VITE_TESTNET_LINK,
    )

    expect(wrapper.find('.dropdown-item.devnet')).toHaveProp(
      'href',
      process.env.VITE_DEVNET_LINK,
    )

    wrapper.unmount()
  })

  it('redirect on custom network input works', () => {
    const wrapper = createWrapper()

    const customInput = wrapper.find('[className="custom-network-form"] input')
    customInput.simulate('change', { target: { value: 'custom_url' } })
    customInput.simulate('submit', { keyCode: 13 })

    expect(mockedFunction).toBeCalledWith(
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )

    wrapper.unmount()
  })

  it('shows no network selected in custom mode with no network', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    const wrapper = createWrapper()

    // expand dropdown
    expect(wrapper.find('.network-custom')).toExist()
    expect(wrapper.find('.network-custom .dropdown-toggle')).toIncludeText(
      'No Custom Network Selected',
    )
  })
})
