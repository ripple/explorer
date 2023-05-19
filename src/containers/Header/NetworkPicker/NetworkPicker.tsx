import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import SocketContext from '../../shared/SocketContext'
import { ANALYTIC_TYPES, analytics } from '../../shared/utils'
import './NetworkPicker.scss'

export interface Network {
  network: string
  title: string
  url: string
}

export const NetworkPicker = () => {
  const CUSTOM_NETWORK_BASE_LINK = process.env.VITE_CUSTOMNETWORK_LINK
  const STATIC_ENV_LINKS: Record<string, string | undefined> = {
    mainnet: process.env.VITE_MAINNET_LINK,
    testnet: process.env.VITE_TESTNET_LINK,
    devnet: process.env.VITE_DEVNET_LINK,
    amm: process.env.VITE_AMM_LINK,
  }
  const currentMode: string = process.env.VITE_ENVIRONMENT || 'mainnet'

  const rippledSocket = useContext(SocketContext)
  const { t } = useTranslation()
  const [newRippledUrl, setNewRippledUrl] = useState('')

  const rippledUrl = rippledSocket?.rippledUrl
  const isCustom = currentMode === 'custom'
  const inNetwork = !(isCustom && rippledUrl === undefined)

  const getNetworkName = (network: string) =>
    t(`network_name`, { context: network })

  const getCustomNetworkName = (url) =>
    `${getNetworkName('custom')}: ${url
      ?.replace(`${CUSTOM_NETWORK_BASE_LINK || ''}/`, '')
      .toLowerCase()}`

  const trackNetworkSwitch = (network: Network) => {
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: network.url,
    })
  }

  const networks = [
    ...Object.entries(STATIC_ENV_LINKS).map(([network, url]) => ({
      network,
      title: getNetworkName(network),
      url,
    })),
  ]

  const handleNetworkClick = (network: Network) => () => {
    trackNetworkSwitch(network)
  }

  const networkPickerTitle = !inNetwork
    ? t('no_network_selected')
    : getNetworkName(currentMode)

  function renderDropdownItem(network, url, text) {
    return (
      <DropdownItem
        key={url}
        href={url}
        className={network}
        handler={handleNetworkClick(network)}
      >
        {text}
      </DropdownItem>
    )
  }

  function renderCustomNetworkInput() {
    return (
      <DropdownItem key="new_network">
        <form onSubmit={onSubmit} className="custom-network-form">
          <input
            type="text"
            placeholder="Add custom network"
            onChange={(e) => setNewRippledUrl(e.target.value)}
            autoCorrect="off"
            autoCapitalize="none"
            autoComplete="off"
          />
        </form>
      </DropdownItem>
    )
  }

  function onSubmit(event) {
    event.preventDefault()
    if (rippledUrl != null && newRippledUrl.toLowerCase() === rippledUrl) {
      return
    }

    trackNetworkSwitch({
      network: 'custom',
      title: `Custom: ${newRippledUrl}`,
      url: newRippledUrl,
    })
    window.location.assign(`${CUSTOM_NETWORK_BASE_LINK}/${newRippledUrl}`)
  }

  return (
    <Dropdown
      title={
        isCustom && inNetwork
          ? getCustomNetworkName(rippledUrl)
          : networkPickerTitle
      }
      className={`network network-${currentMode}`}
    >
      <>
        {networks.map(({ network, title, url = '' }) => {
          if (
            network === currentMode ||
            window.location.href?.indexOf(url) === 0
          ) {
            return null // don't render if we are in that network
          }

          return renderDropdownItem(network, url, title)
        })}
        {renderCustomNetworkInput()}
      </>
    </Dropdown>
  )
}
