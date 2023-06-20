import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../../shared/hooks'
import SocketContext from '../../../shared/SocketContext'
import MockWsClient from '../../../test/mockWsClient'

describe('NetworkPicker component', () => {
  let client
  const { location } = window
  const mockedFunction = jest.fn()
  const oldEnvs = process.env

  const createWrapper = (localNetworks?: string[]) => {
    let Picker

    // Needed to test different env variable values.
    jest.isolateModules(() => {
      ;({ NetworkPicker: Picker } = jest.requireActual('../NetworkPicker'))
    })

    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    return mount(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client}>
            <Picker />
          </SocketContext.Provider>
        </Router>
      </I18nextProvider>,
    )
  }

  beforeEach(() => {
    // @ts-ignore -- typescript does not like mocking window
    delete window.location
    // @ts-ignore -- typescript does not like mocking window
    window.location = { assign: mockedFunction }
    process.env = {
      ...oldEnvs,
      VITE_ENVIRONMENT: 'mainnet',
      VITE_MAINNET_LINK: 'https://livenet.xrpl.org',
      VITE_TESTNET_LINK: 'https://testnet.xrpl.org',
      VITE_DEVNET_LINK: 'https://devnet.xrpl.org',
      VITE_AMM_LINK: 'https://amm-devnet.xrpl.org',
      VITE_CUSTOMNETWORK_LINK: 'https://custom.xrpl.org',
    }
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

  it('shows custom networks in local storage if they exist', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    const wrapper = createWrapper(['custom_url', 'custom_url2'])

    // expand dropdown
    expect(wrapper.find('.network-custom')).toExist()

    expect(wrapper.find('.dropdown-item.custom').length).toEqual(2)
    expect(wrapper.find('.dropdown-item.custom').at(0)).toHaveProp(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )
    expect(wrapper.find('.dropdown-item.custom').at(1)).toHaveProp(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url2`,
    )
    expect(wrapper.find('.dropdown-item.custom .btn-remove').length).toEqual(2)

    expect(wrapper.find('.dropdown-item.testnet')).toExist()
    expect(wrapper.find('.dropdown-item.testnet .btn-remove')).not.toExist()
  })
})
