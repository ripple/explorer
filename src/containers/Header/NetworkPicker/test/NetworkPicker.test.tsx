import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../../i18n/testConfigEnglish'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../../shared/hooks'
import SocketContext from '../../../shared/SocketContext'
import MockWsClient from '../../../test/mockWsClient'
import { NetworkPicker } from '../NetworkPicker'
import { queryClient } from '../../../shared/QueryClient'

describe('NetworkPicker component', () => {
  let client: MockWsClient

  const renderNetworkPicker = (localNetworks: string[] = []) => {
    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    return render(
      <I18nextProvider i18n={i18n}>
        <SocketContext.Provider value={client as any}>
          <Router>
            <QueryClientProvider client={queryClient}>
              <NetworkPicker />
            </QueryClientProvider>
          </Router>
        </SocketContext.Provider>
      </I18nextProvider>,
    )
  }

  const { location } = window
  const mockedFunction = jest.fn()
  const oldEnvs = process.env

  beforeEach(() => {
    // @ts-expect-error - no idea why this errors here but is fine in CustomNetworkHome tests
    delete window.location
    // @ts-expect-error - no idea why this errors here but is fine in CustomNetworkHome tests
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

  it('dropdown expands', async () => {
    const { container } = renderNetworkPicker()
    // The Dropdown component has both .network and .dropdown classes on the same element
    const dropdown = container.querySelector('.network.dropdown')
    expect(dropdown).toBeInTheDocument()
    expect(dropdown).not.toHaveClass('dropdown-expanded')

    await userEvent.click(
      container.querySelector('.network.dropdown .dropdown-toggle')!,
    )
    expect(dropdown).toHaveClass('dropdown-expanded')
  })

  it('direct to other networks', async () => {
    const { container } = renderNetworkPicker()

    // expand dropdown - The Dropdown component has both .network and .dropdown classes on the same element
    expect(container.querySelector('.network.dropdown')).toBeInTheDocument()
    await userEvent.click(
      container.querySelector('.network.dropdown .dropdown-toggle')!,
    )
    expect(
      container.querySelector('.dropdown-item.mainnet'),
    ).not.toBeInTheDocument() // don't show the current network
    expect(
      container.querySelector('.dropdown-item.testnet'),
    ).toBeInTheDocument()

    // test clicking on testnet
    const testnetItem = container.querySelector('.dropdown-item.testnet')
    expect(testnetItem).toHaveAttribute('href', process.env.VITE_TESTNET_LINK)

    const devnetItem = container.querySelector('.dropdown-item.devnet')
    expect(devnetItem).toHaveAttribute('href', process.env.VITE_DEVNET_LINK)
  })

  it('redirect on custom network input works', async () => {
    const { container } = renderNetworkPicker()

    // First expand the dropdown to make the input visible
    await userEvent.click(container.querySelector('.network .dropdown-toggle')!)

    const customInput = screen.getByRole('textbox')
    await userEvent.type(customInput, 'custom_url{Enter}')

    expect(mockedFunction).toHaveBeenCalledWith(
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )
  })

  it('shows no network selected in custom mode with no network', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    const { container } = renderNetworkPicker()

    // expand dropdown
    expect(container.querySelector('.network-custom')).toBeInTheDocument()
    expect(
      container.querySelector('.network-custom .dropdown-toggle'),
    ).toHaveTextContent('No Custom Network Selected')
  })

  it('shows custom networks in local storage if they exist', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    const { container } = renderNetworkPicker(['custom_url', 'custom_url2'])

    // expand dropdown
    expect(container.querySelector('.network-custom')).toBeInTheDocument()

    const customItems = container.querySelectorAll('.dropdown-item.custom')
    expect(customItems).toHaveLength(2)
    expect(customItems[0]).toHaveAttribute(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )
    expect(customItems[1]).toHaveAttribute(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url2`,
    )
    expect(
      container.querySelectorAll('.dropdown-item.custom .btn-remove'),
    ).toHaveLength(2)

    expect(
      container.querySelector('.dropdown-item.testnet'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('.dropdown-item.testnet .btn-remove'),
    ).not.toBeInTheDocument()
  })
})
