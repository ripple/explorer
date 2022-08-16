import React, { KeyboardEvent, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReactComponent as SidechainLogo } from '../shared/images/sidechain_logo.svg'
import Header from '../Header'
import { ANALYTIC_TYPES, analytics } from '../shared/utils'
import { ReactComponent as RightArrow } from '../shared/images/side_arrow_green.svg'
import './index.scss'

interface Props {
  t: (arg: string) => string
}

const SidechainHome = (props: Props) => {
  const { t } = props

  const [networkText, setNetworkText] = useState('')

  function switchMode(desiredLink: string) {
    const sidechainUrl = process.env.REACT_APP_SIDECHAIN_LINK
    const url = `${sidechainUrl}/${desiredLink}`
    analytics(ANALYTIC_TYPES.event, {
      eventCategory: 'mode switch',
      eventAction: url,
    })
    // TODO: do some validation on this??
    window.location.assign(url)
  }

  function sidechainOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && networkText != null) {
      switchMode(networkText)
    }
  }

  function clickButton(
    _event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
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
      <div className="sidechain-main-page">
        <div className="logo-content">
          <SidechainLogo className="sidechain-logo" />
          <div className="page-header">{t('sidechain_custom_network')}</div>
          <div className="input-help">{t('sidechain_network_input_help')}</div>
          <input
            className="sidechain-input"
            type="text"
            placeholder={t('sidechain_network_input')}
            onKeyDown={sidechainOnKeyDown}
            value={networkText}
            onChange={(event) => setNetworkText(event.target.value)}
          />
          <div
            className="sidechain-input-button"
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
            <div className="custom-network-header">
              {t('sidechain_networks')}
            </div>
            {existingNetworks.map(renderCustomNetwork)}
          </div>
        )}
      </div>
    </div>
  )
}

export default withTranslation()(SidechainHome)
