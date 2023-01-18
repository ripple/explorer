import { KeyboardEvent, MouseEvent as ReactMouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReactComponent as CustomNetworkLogo } from '../shared/images/custom_network_logo.svg'
import Header from '../Header'
import { ANALYTIC_TYPES, analytics } from '../shared/utils'
import { ReactComponent as RightArrow } from '../shared/images/side_arrow_green.svg'
import './index.scss'

const SidechainHome = () => {
  const { t } = useTranslation()

  const [networkText, setNetworkText] = useState('')

  function switchMode(desiredLink: string) {
    const customNetworkUrl = process.env.REACT_APP_CUSTOMNETWORK_LINK
    const url = `${customNetworkUrl}/${desiredLink}`
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: url,
    })
    // TODO: do some validation on this??
    window.location.assign(url)
  }

  function customNetworkOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && networkText != null) {
      switchMode(networkText)
    }
  }

  function clickButton(
    _event:
      | ReactMouseEvent<HTMLDivElement, MouseEvent>
      | KeyboardEvent<HTMLDivElement>,
  ) {
    if (networkText != null) {
      switchMode(networkText)
    }
  }

  function renderCustomNetwork(network: string) {
    return (
      <Link key={network} className="custom-network-item" to={`/${network}`}>
        <div key={network} className="custom-network-text">
          {network}
        </div>
        <RightArrow className="custom-network-arrow" />
      </Link>
    )
  }

  // TODO: get previous networks from cookies
  const existingNetworks: string[] = []

  return (
    <div className="app">
      {/* @ts-ignore -- TODO: I think this error is because Header isn't in TS */}
      <Header inNetwork={false} />
      <div className="custom-network-main-page">
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
          <div
            className="custom-network-input-button"
            tabIndex={0}
            role="button"
            onClick={clickButton}
            onKeyUp={clickButton}
          >
            <span>Go to network</span>
          </div>
        </div>
        {existingNetworks.length > 0 && (
          <div className="custom-network-list">
            <div className="custom-network-header">{t('custom_networks')}</div>
            {existingNetworks.map(renderCustomNetwork)}
          </div>
        )}
      </div>
    </div>
  )
}

export default SidechainHome
