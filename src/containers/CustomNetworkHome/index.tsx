import { KeyboardEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import CustomNetworkLogo from '../shared/images/custom_network_logo.svg'
import RightArrow from '../shared/images/side_arrow_green.svg'
import { useAnalytics } from '../shared/analytics'
import './index.scss'
import { useCustomNetworks } from '../shared/hooks'
import { Header } from '../Header'

const SidechainHome = () => {
  const { track, trackScreenLoaded } = useAnalytics()
  const { t } = useTranslation()
  const [networkText, setNetworkText] = useState('')
  const [customNetworks = []] = useCustomNetworks()

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  function switchMode(desiredLink: string) {
    const customNetworkUrl = process.env.VITE_CUSTOMNETWORK_LINK
    const url = `${customNetworkUrl}/${desiredLink}`

    track('network_switch', {
      network: 'custom',
      entrypoint: desiredLink,
    })

    // TODO: do some validation on this??
    window.location.assign(url)
  }

  function customNetworkOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && networkText != null) {
      switchMode(networkText)
    }
  }

  function renderCustomNetwork(network: string) {
    return (
      <Link key={network} className="custom-network-item" to={`/${network}`}>
        <div
          key={network}
          className="custom-network-text"
          title="custom-network-name"
        >
          {network}
        </div>
        <RightArrow className="custom-network-arrow" />
      </Link>
    )
  }

  return (
    <>
      <Header inNetwork={false} />
      <div
        className="custom-network-main-page"
        title="custom-network-main-page"
      >
        <div className="logo-content">
          <CustomNetworkLogo className="custom-network-logo" />
          <div className="page-header">{t('custom_network')}</div>
          <div className="input-help">{t('custom_network_input_help')}</div>
          <input
            className="custom-network-input"
            type="text"
            placeholder={t('custom_network_input')}
            onKeyDown={customNetworkOnKeyDown}
            value={networkText}
            onChange={(event) => setNetworkText(event.target.value)}
          />
        </div>
        {customNetworks.length > 0 && (
          <div className="custom-network-list">
            <div className="custom-network-header">{t('custom_networks')}</div>
            {customNetworks.map(renderCustomNetwork)}
          </div>
        )}
      </div>
    </>
  )
}

export default SidechainHome
